/**
 * UNIT TEST: ThemeContext
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '../../test/test-utils';
import { ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeContext', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Storage.prototype.getItem = vi.fn((key: string) => localStorageMock[key] || null);
    Storage.prototype.setItem = vi.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
  });

  it('should provide default theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBeDefined();
    expect(['light', 'dark']).toContain(result.current.theme);
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
