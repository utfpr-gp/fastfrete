import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: Transporter;
  private readonly isDev: boolean;

  constructor() {
    this.isDev = !process.env.SMTP_HOST;

    if (this.isDev) {
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    if (this.isDev) {
      this.logger.warn(`[DEV] Password reset token para ${email}:`);
      this.logger.warn(`[DEV] ${resetUrl}`);
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@fastfrete.com',
      to: email,
      subject: 'Redefinição de senha — FastFrete',
      html: `
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha. O link expira em 1 hora.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Se você não fez essa solicitação, ignore este email.</p>
      `,
    });
  }
}
