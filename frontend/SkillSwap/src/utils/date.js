import { format } from 'date-fns';

export const formatDateTime = (value) => format(new Date(value), 'PPpp');
