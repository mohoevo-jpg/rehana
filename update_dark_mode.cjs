const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/Settings.vue');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Labels
  {
    from: /label class="block text-sm font-medium text-gray-700 mb-1"/g,
    to: 'label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"'
  },
  {
    from: /label class="block text-sm font-medium text-gray-700 mb-3"/g,
    to: 'label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"'
  },
  // H3 Section Titles
  {
    from: /h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4"/g,
    to: 'h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4"'
  },
  {
    from: /h3 class="text-lg font-medium text-gray-900"/g,
    to: 'h3 class="text-lg font-medium text-gray-900 dark:text-white"'
  },
  // H4 Titles
  {
    from: /h4 class="text-base font-bold text-gray-900"/g,
    to: 'h4 class="text-base font-bold text-gray-900 dark:text-white"'
  },
  {
    from: /h4 class="text-sm font-medium text-gray-900 mb-4"/g,
    to: 'h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4"'
  },
  {
    from: /h4 class="text-sm font-medium text-gray-900"/g,
    to: 'h4 class="text-sm font-medium text-gray-900 dark:text-white"'
  },
  {
    from: /h4 class="text-lg font-bold text-gray-900 border-b pb-2"/g,
    to: 'h4 class="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2"'
  },
  {
    from: /h4 class="text-lg font-bold text-gray-900"/g,
    to: 'h4 class="text-lg font-bold text-gray-900 dark:text-white"'
  },
  // Subtext
  {
    from: /p class="text-sm text-gray-500"/g,
    to: 'p class="text-sm text-gray-500 dark:text-gray-400"'
  },
  {
    from: /p class="text-xs text-gray-500 mt-1"/g,
    to: 'p class="text-xs text-gray-500 dark:text-gray-400 mt-1"'
  },
  {
    from: /p class="text-xs text-gray-500"/g,
    to: 'p class="text-xs text-gray-500 dark:text-gray-400"'
  },
  // H5 Titles
  {
    from: /h5 class="font-bold text-gray-900 flex items-center gap-2"/g,
    to: 'h5 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"'
  },
  // Cards / Containers
  {
    from: /div class="bg-white border rounded-lg/g,
    to: 'div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg'
  },
  {
    from: /div class="bg-white rounded-lg border overflow-hidden"/g,
    to: 'div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden"'
  },
  // Table Headers
  {
    from: /thead class="bg-gray-50"/g,
    to: 'thead class="bg-gray-50 dark:bg-gray-900"'
  },
  {
    from: /th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"/g,
    to: 'th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"'
  },
  // Table Body
  {
    from: /tbody class="bg-white divide-y divide-gray-200"/g,
    to: 'tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"'
  },
  {
    from: /div class="text-sm font-medium text-gray-900"/g,
    to: 'div class="text-sm font-medium text-gray-900 dark:text-white"'
  },
  {
    from: /div class="text-sm text-gray-500"/g,
    to: 'div class="text-sm text-gray-500 dark:text-gray-400"'
  },
  {
    from: /td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"/g,
    to: 'td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"'
  },
  {
    from: /td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold"/g,
    to: 'td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold"'
  },
  // Campaign Items
  {
    from: /div class="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"/g,
    to: 'div class="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"'
  },
  {
    from: /p class="text-sm text-gray-600 mt-1"/g,
    to: 'p class="text-sm text-gray-600 dark:text-gray-300 mt-1"'
  },
  // Footer
  {
    from: /div class="bg-gray-50 p-4 border-t flex justify-end gap-3"/g,
    to: 'div class="bg-gray-50 dark:bg-gray-900 p-4 border-t dark:border-gray-700 flex justify-end gap-3"'
  },
  // Modals
  {
    from: /div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"/g,
    to: 'div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"'
  },
  {
    from: /div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"/g,
    to: 'div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"'
  },
  {
    from: /h3 class="text-lg leading-6 font-medium text-gray-900 mb-4"/g,
    to: 'h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4"'
  },
  {
    from: /div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"/g,
    to: 'div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"'
  },
  // Campaign Modal
  {
    from: /div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"/g,
    to: 'div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"'
  }
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content);
console.log('Updated Settings.vue with dark mode classes');
