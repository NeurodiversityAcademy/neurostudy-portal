import { renderHook } from '@testing-library/react';
import useDefaultValue from '@/app/hooks/useDefaultValue';

describe('useDefaultValue', () => {
  const mockSetValue = jest.fn();

  const makeRenderProps = (overrides: Record<string, unknown> = {}) => ({
    field: {
      name: 'testField' as const,
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
      ...overrides,
    },
    fieldState: {
      isDirty: false,
      isTouched: false,
      invalid: false,
      error: undefined,
      ...overrides,
    },
    formState: {} as never,
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockSetValue.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets the default value when the field is not dirty', () => {
    const renderProps = makeRenderProps();

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: 'hello' as never,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).toHaveBeenCalledWith('testField', 'hello');
  });

  it('does not set the value when the field is dirty', () => {
    const renderProps = makeRenderProps({ isDirty: true });

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: 'hello' as never,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it('does not set the value when defaultValue is undefined', () => {
    const renderProps = makeRenderProps();

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: undefined,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it('does not set the value when field value equals defaultValue', () => {
    const renderProps = makeRenderProps({ value: 'same' });

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: 'same' as never,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it('sets array defaultValue when field value is empty array', () => {
    const renderProps = makeRenderProps({ value: [] });

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: ['a', 'b'] as never,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).toHaveBeenCalledWith('testField', ['a', 'b']);
  });

  it('does not set array defaultValue when field already has values', () => {
    const renderProps = makeRenderProps({ value: ['existing'] });

    renderHook(() =>
      useDefaultValue({
        renderProps: renderProps as never,
        defaultValue: ['a', 'b'] as never,
        setValue: mockSetValue,
      }),
    );

    jest.runAllTimers();

    expect(mockSetValue).not.toHaveBeenCalled();
  });
});
