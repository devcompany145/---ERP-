
export enum ProjectStatus {
  PLANNING = 'تخطيط',
  IN_PROGRESS = 'قيد التنفيذ',
  TESTING = 'مرحلة الاختبار',
  COMPLETED = 'مكتمل',
  ON_HOLD = 'متوقف مؤقتاً'
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  cost: number;
}

export interface TimeLog {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // بالساعات
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  hours: number;
  dueDate?: string;
  externalId?: string;
  externalSource?: 'Jira' | 'Asana' | 'GitHub';
  timeLogs?: TimeLog[];
}

export interface ProjectResource {
  id: string;
  role: string;
  allocatedMember?: string;
  allocationPercentage: number;
  status: 'مكتمل' | 'قيد البحث' | 'عجز';
  requiredSkills: string[];
}

export interface CostHistoryItem {
  date: string; // YYYY-MM
  budget: number;
  actual: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  deadline: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  actualCost: number;
  profit: number;
  team: string[];
  projectManager: string;
  technicalLead: string;
  qaEngineer: string;
  contractId?: string;
  repoUrl?: string;
  cloudCost?: number;
  totalHours?: number;
  milestones: Milestone[];
  tasks: Task[];
  resources: ProjectResource[];
  costHistory: CostHistoryItem[];
  externalProjectId?: string;
  connectedTool?: 'Jira' | 'Asana';
}

export type ProductCategory = 'برمجيات' | 'استشارات' | 'أجهزة';
export type ProductType = 'product' | 'service';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  type: ProductType;
  basePrice: number;
  pricingModel: string;
  sku?: string;
  status: 'نشط' | 'متوقف';
  features?: string[];
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  totalRevenue: number;
  joinDate: string;
  industry: string;
}

export interface Communication {
  id: string;
  customerId: string;
  date: string;
  type: string;
  notes: string;
  staffName: string;
}

export type PricingModel = 'بالمشروع' | 'بالساعة' | 'اشتراك شهري' | 'اشتراك سنوي';

export interface OfferItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Offer {
  id: string;
  customerId: string;
  title: string;
  value: number;
  date: string;
  status: string;
  pricingModel: PricingModel;
  validUntil: string;
  items: OfferItem[];
  convertedTo?: 'مشروع' | 'عقد' | 'فاتورة';
  convertedId?: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName?: string;
  subject: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed';
  date: string;
  lastUpdate?: string;
  category: 'technical' | 'billing' | 'feature_request' | 'other';
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  lastUpdated: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  email: string;
  phone: string;
  salary: number;
  allowances: { housing: number; transport: number; other: number };
  deductions: { insurance: number; tax: number; other: number };
  salaryHistory: { date: string; amount: number; reason: string }[];
  hourlyRate: number;
  joinDate: string;
  docExpiry: string;
  leaveBalance: number;
  contractType: string;
  skills: string[];
  productivity: {
    tasksCompleted: number;
    tasksAssigned: number;
    avgTaskTime: number;
    milestonesReached: number;
    impactScore: number;
    gitCommits: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

export type IncomeCategory = 'مشاريع برمجية' | 'خدمات استشارية' | 'اشتراكات SaaS' | 'مبيعات أجهزة' | 'أخرى';
export type ExpenseCategory = 'رواتب وأجور' | 'بنية تحتية وسحابة' | 'إيجارات ومرافق' | 'تسويق وإعلان' | 'تراخيص برمجية' | 'أخرى';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'دخل' | 'مصروف';
  category: IncomeCategory | ExpenseCategory;
  projectId?: string;
  supplierId?: string;
  isVatApplicable: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  projectId: string;
  date: string;
  dueDate: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
}

export type ContractStatus = 'نشط' | 'منتهي' | 'قيد التجديد' | 'مسودة';

export interface Contract {
  id: string;
  title: string;
  client: string;
  type: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: number;
  billingCycle: string;
  autoRenew: boolean;
  projectId?: string;
}

export type DocStatus = 'draft' | 'pending_signature' | 'signed' | 'sent';

export interface SignedDocument {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  status: DocStatus;
  createdAt: string;
  signedAt?: string;
  sentAt?: string;
  content: string;
  version: number;
  signatureData?: string;
}

export interface Asset {
  id: string;
  name: string;
  code: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  assignedTo?: string;
  location: string;
  status: AssetStatus;
  specifications?: string;
  lastMaintenance?: string;
}

export type AssetCategory = 'أجهزة تقنية' | 'أثاث مكتبي' | 'تراخيص برمجية' | 'مركبات' | 'أصول نقدية' | 'أصول غير ملموسة';
export type AssetStatus = 'نشط' | 'تحت الصيانة' | 'مستهلك' | 'مفقود';

export interface LandingPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  isPublished: boolean;
  lastUpdate: string;
  features: LandingFeature[];
  stats: LandingStat[];
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LandingStat {
  id: string;
  label: string;
  value: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  totalPaid: number;
  balance: number;
  joinDate: string;
}

export interface OfficialDocument {
  id: string;
  title: string;
  type: 'سجل تجاري' | 'شهادة ضريبية' | 'ترخيص بلدي' | 'تأمين' | 'عضوية' | 'أخرى';
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  status: 'active' | 'expired' | 'expiring_soon';
  notes?: string;
}
