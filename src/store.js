import { create } from 'zustand';

export const useStore = create((set) => ({
  activeProject: null,
  setActiveProject: (projectData) => set({ activeProject: projectData }),
  clearActiveProject: () => set({ activeProject: null }),

  isDomainSelectorOpen: false,
  setDomainSelectorOpen: (isOpen) => set({ isDomainSelectorOpen: isOpen }),
  
  activeDomain: null, // 'web' or 'video'
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  
  domainWorldPosition: null,
  setDomainWorldPosition: (pos) => set({ domainWorldPosition: pos })
}));
