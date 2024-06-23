/* eslint-disable no-param-reassign */
export default function resizeText(container: HTMLElement, {
  size = 12,
  minsize = 7,
  step = 0.5,
  height = true,
  both = false,
} = {}): boolean {
  container.style.fontSize = '';

  const check = [];
  if (height || both) {
    check.push('Height');
  }
  if (!height || both) {
    check.push('Width');
  }

  let fixedSize = size;
  check.forEach((type) => {
    fixedSize = doResize(container, {
      size: fixedSize, minsize, step, type,
    });
  });
  return fixedSize !== size;
}

function doResize(container: HTMLElement, {
  size = 12,
  minsize = 7,
  step = 0.5,
  type = 'Height',
}): number {
  let fixedSize = size;
  const scrollKey = type === 'Height' ? 'scrollHeight' : 'scrollWidth';
  const clientKey = type === 'Height' ? 'clientHeight' : 'clientWidth';
  while (
    (
      container[scrollKey] > container[clientKey]
      || container[scrollKey] > container.parentElement![clientKey]
    )
    && fixedSize - step > minsize
  ) {
    fixedSize -= step;
    container.style.fontSize = `${fixedSize}px`;
  }
  return fixedSize;
}
