import { renderHook } from '@testing-library/react';
import useClickOutside from '@/app/hooks/useClickOutside';

describe('useClickOutside', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    document.body.innerHTML = '';
  });

  it('calls onClose when clicking outside the dialog', () => {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);

    renderHook(() => useClickOutside(mockOnClose));

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the dialog', () => {
    const dialog = document.createElement('dialog');
    const inner = document.createElement('div');
    dialog.appendChild(inner);
    document.body.appendChild(dialog);

    renderHook(() => useClickOutside(mockOnClose));

    inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when no dialog exists', () => {
    renderHook(() => useClickOutside(mockOnClose));

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);

    const { unmount } = renderHook(() => useClickOutside(mockOnClose));
    unmount();

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not add duplicate listeners on re-render with same callback', () => {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);

    const { rerender } = renderHook(() => useClickOutside(mockOnClose));
    rerender();

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
