import { $, useStore, useOnWindow } from '@builder.io/qwik';
import jsyaml from 'js-yaml';

export interface SimpleChecklistItem {
  point: string;
  category: string;
  details: string;
}

export const useSimpleChecklist = () => {
  const state = useStore<{ checklist: SimpleChecklistItem[] | null }>({ checklist: null });

  const fetchChecklist = $(async () => {
    const localUrl = '/simple-checklist.yml';
    return fetch(localUrl)
      .then((res) => res.text())
      .then((yamlText) => {
        return jsyaml.load(yamlText);
      });
  });

  useOnWindow('load', $(() => {
    fetchChecklist().then((checklist) => {
      state.checklist = checklist as SimpleChecklistItem[];
    });
  }));

  const setChecklist = $((newChecklist: SimpleChecklistItem[]) => {
    state.checklist = newChecklist;
  });

  return { checklist: state, setChecklist };
}; 