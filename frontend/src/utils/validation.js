export const isWhatsAppNumber = (value) => /^[0-9]{8,15}$/.test(value || '');
