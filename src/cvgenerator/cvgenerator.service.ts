import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { chromium } from 'playwright-chromium';
import { format } from '@formkit/tempo';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { GenerateCvDto } from './dto/GenerateCvDto';
import { User } from 'generated/prisma/client';

function CalPeriod(startDate: string | Date, endDate: string | Date | null) {
  const locale = 'es';
  const formatToken = 'MMMM YYYY';

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  if (isNaN(start.getTime())) return '';

  const initial = format(start.toISOString(), formatToken, locale);

  if (endDate) {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    if (isNaN(end.getTime())) return `${initial} - Presente`;
    return `${initial} - ${format(end.toISOString(), formatToken, locale)}`;
  }

  return `${initial} - Presente`;
}

@Injectable()
export class CvgeneratorService {
  constructor(private prisma: PrismaService) {}

  private static registerHelpers() {
    Handlebars.registerHelper(
      'CalPeriod',
      (startDate: string, endDate: string | null) =>
        CalPeriod(startDate, endDate),
    );
  }

  private async generatePdf(templateName: string, data: any): Promise<Buffer> {
    CvgeneratorService.registerHelpers();

    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );

    if (!fs.existsSync(templatePath))
      throw new NotFoundException(`Template no encontrado: ${templateName}`);

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);
    const htmlContent = template(data);

    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  private formatFileName(userName: string) {
    return (
      userName
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '') + '_CV.pdf'
    );
  }

  async generateCv(
    dto: GenerateCvDto,
  ): Promise<{ pdf: Buffer; fileName: string }> {
    const [user, skills, languages, education, experience, projects] =
      await Promise.all([
        dto.userId?.length ? this.getUserInfo(dto.userId) : <User>{},
        dto.skillsIds?.length ? this.getSkills(dto.skillsIds) : { skills: [] },
        dto.languagesIds?.length
          ? this.getLanguages(dto.languagesIds)
          : { languages: [] },
        dto.educationIds?.length
          ? this.getEducation(dto.educationIds)
          : { education: [] },
        dto.experienceIds?.length
          ? this.getExperience(dto.experienceIds)
          : { experience: [] },
        dto.projectsIds?.length
          ? this.getProjects(dto.projectsIds)
          : { projects: [] },
      ]);

    const cvData = {
      ...user,
      ...skills,
      ...languages,
      ...education,
      ...experience,
      ...projects,
    };
    const pdf = await this.generatePdf(`Cv${dto.templateId}`, cvData);
    const fileName = this.formatFileName(user.name);
    return { pdf, fileName };
  }

  private async getUserInfo(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
      select: {
        name: true,
        bio: true,
        title: true,
        subTitle: true,
        location: true,
        hostUrl: true,
        email: true,
        phone: true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  private async getSkills(ids: number[]) {
    const skills = await this.prisma.skill.findMany({
      where: { id: { in: ids } },
      select: { name: true, level: true, category: true },
    });

    const grouped: Record<string, { name: string; level: number }[]> = {};
    skills.forEach((s) => {
      const cat = s.category ?? 'Sin categoría';
      const lvl = s.level ?? 0;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ name: s.name, level: lvl });
    });

    const skillsByCategory = Object.entries(grouped).map(
      ([category, items]) => ({
        category,
        items: items.sort((a, b) => b.level - a.level),
      }),
    );

    skillsByCategory.sort((a, b) => a.category.localeCompare(b.category));

    return { skills: skillsByCategory };
  }

  private async getLanguages(ids: number[]) {
    const languages = await this.prisma.language.findMany({
      where: { id: { in: ids } },
      select: { language: true, level: true },
    });
    return { languages };
  }

  private async getEducation(ids: number[]) {
    const education = await this.prisma.education.findMany({
      where: { id: { in: ids } },
      select: {
        title: true,
        institution: true,
        startDate: true,
        endDate: true,
      },
      orderBy: { startDate: 'desc' },
    });
    return {
      education: education.map((e) => ({
        title: e.title,
        institution: e.institution,
        period: CalPeriod(e.startDate, e.endDate),
      })),
    };
  }

  private async getExperience(ids: number[]) {
    const experience = await this.prisma.experience.findMany({
      where: { id: { in: ids } },
      select: {
        role: true,
        company: true,
        startDate: true,
        endDate: true,
        description: true,
        responsibilities: true,
      },
      orderBy: { startDate: 'desc' },
    });
    return {
      experience: experience.map((e) => ({
        role: e.role,
        company: e.company,
        period: CalPeriod(e.startDate, e.endDate),
        description: e.description,
        responsibilities: e.responsibilities,
      })),
    };
  }

  private async getProjects(ids: number[]) {
    const projects = await this.prisma.project.findMany({
      where: { id: { in: ids } },
      select: {
        title: true,
        subtitle: true,
        description: true,
        role: true,
        techStack: true,
        demoUrl: true,
        repoUrl: true,
        highlight: true,
      },
    });
    return {
      projects: projects
        .sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0))
        .map((p) => ({
          name: p.title,
          subtitle: p.subtitle,
          description: p.description,
          stack: p.techStack,
          role: p.role,
          demo: p.demoUrl,
          repo: p.repoUrl,
          highlight: p.highlight ?? false,
        })),
    };
  }
}
