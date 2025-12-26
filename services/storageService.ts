
import { Project } from '../types';

const STORAGE_KEY = 'tech_erp_projects_db';

export const storageService = {
  // جلب كافة المشاريع
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing storage data", e);
      return [];
    }
  },

  // حفظ/تحديث مشروع معين
  saveProject: (project: Project): void => {
    const projects = storageService.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  // تهيئة البيانات الأولية إذا كان النظام فارغاً
  initIfEmpty: (defaultData: Project[]): Project[] => {
    const current = storageService.getProjects();
    if (current.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return current;
  }
};
