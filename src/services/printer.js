// Printer Service
export const printReceipt = (data) => {
  console.log('Printing receipt...', data);
  // In Electron, we would use ipcRenderer to send data to main process for printing
  // window.electronAPI.send('print', data);
  
  // For web, we can just print the window
  window.print();
};
