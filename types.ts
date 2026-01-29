
export interface Session {
  id: string;
  clientName: string;
  ipAddress: string;
  startTime: Date;
  status: 'active' | 'waiting' | 'ended';
  os: string;
}

export interface Message {
  id: string;
  sender: 'agent' | 'client' | 'system';
  text: string;
  timestamp: Date;
}

export interface DiagnosticInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: string;
  processes: { name: string; cpu: number; mem: number }[];
}

export interface AIAnalysis {
  issue: string;
  suggestion: string;
  confidence: number;
}

export interface User {
  id: string;
  username: string;
  role: 'agent' | 'admin';
  isTwoFactorEnabled: boolean;
}

export interface Booking {
  id: string;
  problemType: string;
  description: string;
  scheduledAt: string;
  clientEmail: string;
  status: 'pending' | 'confirmed';
}
