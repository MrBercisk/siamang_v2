export interface ChatMessage {
  id: number;
  sender: string;
  role: 'applicant' | 'mentor';
  message: string;
  timestamp: string;
}