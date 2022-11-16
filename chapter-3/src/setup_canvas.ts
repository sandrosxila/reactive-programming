export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");
export const setUpCanvas = () => {
  const canvasWrapper = document.createElement('div');
  canvasWrapper.style.width = '100vw';
  canvasWrapper.style.height = '100vh';
  canvasWrapper.style.overflow = 'hidden';
  
  document.body.appendChild(canvasWrapper);

  canvasWrapper.appendChild(canvas);
  canvas.width = canvasWrapper.offsetWidth;
  canvas.height = canvasWrapper.offsetHeight;
};
