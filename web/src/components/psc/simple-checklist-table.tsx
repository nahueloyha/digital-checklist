import { $, component$, useStore, useSignal } from "@builder.io/qwik";
import { useCSSTransition } from "qwik-transition";

import Icon from "~/components/core/icon";
import { marked } from "marked";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import styles from './psc.module.css';

interface SimpleChecklistItem {
  point: string;
  category: string;
  details: string;
}

export default component$((props: { items: SimpleChecklistItem[] }) => {

  const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});

  const showFilters = useSignal(false);
  const { stage } = useCSSTransition(showFilters, { timeout: 300 });

  const sortState = useStore({ column: '', ascending: true });

  const checklist = useSignal<SimpleChecklistItem[]>(props.items);

  const originalFilters = {
    show: 'all', // 'all', 'remaining', 'completed'
    categories: {} as Record<string, boolean>,
  };

  // Initialize categories filter
  props.items.forEach(item => {
    if (!originalFilters.categories[item.category]) {
      originalFilters.categories[item.category] = true;
    }
  });

  const filterState = useStore(originalFilters);

  const generateId = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-');
  };

  const parseMarkdown = (text: string | undefined): string => {
    return marked.parse(text || '', { async: false }) as string || '';
  };

  const isChecked = (pointId: string) => {
    return completed.value[pointId] || false;
  };

  const filteredChecklist = checklist.value.filter((item) => {
    const itemId = generateId(item.point);
    const itemCompleted = isChecked(itemId);
    const itemCategory = item.category;

    // Filter by completion status
    if (filterState.show === 'remaining' && itemCompleted) return false;
    if (filterState.show === 'completed' && !itemCompleted) return false;

    // Filter by category
    if (!filterState.categories[itemCategory]) return false;

    return true;
  });

  const sortChecklist = (a: SimpleChecklistItem, b: SimpleChecklistItem) => {
    const getValue = (item: SimpleChecklistItem) => {
      switch (sortState.column) {
        case 'done':
          return isChecked(generateId(item.point)) ? 0 : 1;
        case 'advice':
          return item.point;
        case 'category':
          return item.category;
        default:
          return 0;
      }
    };
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA === valueB) {
      return 0;
    } else if (sortState.ascending) {
      return valueA < valueB ? -1 : 1;
    } else {
      return valueA > valueB ? -1 : 1;
    }
  };

  const handleSort = $((column: string) => {
    if (sortState.column === column) { // Reverse direction if same column
      sortState.ascending = !sortState.ascending;
    } else { // Sort table by column
      sortState.column = column;
      sortState.ascending = true; // Default to ascending
    }
  });

  const resetFilters = $(() => {
    checklist.value = props.items;
    sortState.column = '';
    sortState.ascending = true;
    filterState.categories = originalFilters.categories;
    filterState.show = originalFilters.show;
  });

  const calculateProgress = (): { done: number, total: number, percent: number} => {
    let done = 0;
    let total = 0;

    props.items.forEach((item) => {
      const itemId = generateId(item.point);
      if (isChecked(itemId)) {
        done += 1;
      }
      total += 1;
    });

    const percent = Math.round((done / total) * 100);
    return { done, total, percent };
  };

  const { done, total, percent } = calculateProgress();

  return (
    <>

    <div class="flex flex-wrap justify-between items-center">
      <div>
        <progress class="progress w-64" value={percent} max="100"></progress>
        <p class="text-xs text-center">
          {done} out of {total} ({percent}%) complete</p>
      </div>

      <div class="flex flex-wrap gap-2 justify-end my-4">
        {(sortState.column || JSON.stringify(filterState) !== JSON.stringify(originalFilters)) && (
          <button class="btn btn-sm hover:btn-primary" onClick$={resetFilters}>
            <Icon width={18} height={16} icon="clear"/>
            Reset Filters
          </button>
        )}
        <button class="btn btn-sm hover:btn-primary" onClick$={() => { showFilters.value = !showFilters.value; }}>
          <Icon width={18} height={16} icon="filters"/>
          {showFilters.value ? 'Hide' : 'Show'} Filters
        </button>
      </div>
    </div>

    {showFilters.value && (
      <div class="flex flex-wrap justify-between bg-base-100 rounded px-4 py-1 transition-all"
        style={{ opacity: stage.value === "enterTo" ? 1 : 0, height: stage.value === "enterTo" ? 'auto' : 0 }}> 
        {/* Filter by completion */}
        <div class="flex justify-end items-center gap-1">
          <p class="font-bold text-sm">Show</p>
          <label onClick$={() => (filterState.show = 'all')}
            class="p-2 rounded hover:bg-front transition-all cursor-pointer flex gap-2">
            <span class="text-sm">All</span> 
            <input type="radio" name="show" class="radio radio-sm checked:radio-info" checked />
          </label>
          <label onClick$={() => (filterState.show = 'remaining')}
            class="p-2 rounded hover:bg-front transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Remaining</span> 
            <input type="radio" name="show" class="radio radio-sm checked:radio-error" />
          </label>
          <label onClick$={() => (filterState.show = 'completed')}
            class="p-2 rounded hover:bg-front transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Completed</span> 
            <input type="radio" name="show" class="radio radio-sm checked:radio-success" />
          </label>
        </div>
        {/* Filter by category */}
        <div class="flex justify-end items-center gap-1">
          <p class="font-bold text-sm">Categories</p>
          {Object.keys(filterState.categories).map(category => (
            <label key={category} class="p-2 rounded hover:bg-front transition-all cursor-pointer flex gap-2">
              <span class="text-sm">{category}</span> 
              <input
                type="checkbox"
                checked={filterState.categories[category]}
                onChange$={() => (filterState.categories[category] = !filterState.categories[category])}
                class="checkbox checkbox-sm checked:checkbox-primary"
              />
            </label>
          ))}
        </div>
      </div>
    )}

    <table class="table">
      <thead>
        <tr>
          { [
            { id: 'done', text: 'Done?'},
            { id: 'advice', text: 'Advice' },
            { id: 'category', text: 'Category' }
          ].map((item) => (
            <th
              key={item.id}
              class="cursor-pointer"
              onClick$={() => handleSort(item.id)}
            >
              <span class="flex items-center gap-0.5 hover:text-primary transition">
                <Icon width={12} height={14} icon="sort" />
                {item.text}
              </span>
            </th>
          ))}
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredChecklist.sort(sortChecklist).map((item, index) => {
          const itemId = generateId(item.point);
          const isItemCompleted = isChecked(itemId);
          return (
            <tr key={index} class={[
              'rounded-sm transition-all',
              isItemCompleted ? 'bg-success bg-opacity-10' : '',
              !isItemCompleted ? 'hover:bg-opacity-5 hover:bg-success' : '',
              ]}>
              <td class="text-center">
                <input
                  type="checkbox"
                  class="checkbox checked:checkbox-success hover:checkbox-success"
                  id={`done-${itemId}`}
                  checked={isChecked(itemId)}
                  onClick$={() => {
                    const data = completed.value;
                    data[itemId] = !data[itemId];
                    setCompleted(data);
                  }}
                />
              </td>
              <td>
                <label
                  for={`done-${itemId}`}
                  class="text-base font-bold cursor-pointer">
                  {item.point}
                </label>
              </td>
              <td>
                <div class="badge badge-outline">
                  {item.category}
                </div>
              </td>
              <td class={styles.checklistItemDescription} dangerouslySetInnerHTML={parseMarkdown(item.details)}></td>
            </tr>
          )}
        )}
      </tbody>
    </table>
    </>
  );
}); 