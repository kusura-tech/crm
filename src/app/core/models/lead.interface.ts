export type MessageStatus = 'new' | 'read' | 'replied' | 'archived' | 'converted';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone : string
  company: string;
  subject: string;
  body: string;
  status: MessageStatus;
  createdAt: Date;
  serviceType: string
}