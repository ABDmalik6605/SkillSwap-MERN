const logOnlyTransport = {
  sendMail: async (options) => {
    console.info('[mailer-placeholder]', options);
    return { messageId: 'placeholder-id' };
  }
};

export const sendTemplatedEmail = async ({ to, subject, text }) => {
  if (!to) throw new Error('Recipient address required');
  return logOnlyTransport.sendMail({ from: 'noreply@skillswap.local', to, subject, text });
};

// Alias for compatibility
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) throw new Error('Recipient address required');
  return logOnlyTransport.sendMail({ 
    from: 'noreply@skillswap.local', 
    to, 
    subject, 
    html: html || text,
    text 
  });
};
