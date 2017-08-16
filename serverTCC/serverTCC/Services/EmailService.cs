using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace serverTCC.Services
{
    public class EmailService
    {
        public async Task<bool> SendEmail(string email, string mensagem, string assunto, string nome)
        {
            try
            {
                string remetente = "projectjarbas@gmail.com";
                string tituloRemetente = "Project Jarbas";

                string smtpServer = "smtp.gmail.com";
                int smtpPorta = 465;

                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(tituloRemetente, remetente));
                mimeMessage.To.Add(new MailboxAddress(nome, email));
                mimeMessage.Subject = assunto;
                mimeMessage.Body = new TextPart("plain")
                {
                    Text = mensagem
                };

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPorta, true);

                    await client.AuthenticateAsync(remetente, "s0000000000");

                    await client.SendAsync(mimeMessage);

                    await client.DisconnectAsync(true);

                    return true;
                }
            }
            catch(Exception e)
            {
                throw e;
            }
            
        }
    }
}
