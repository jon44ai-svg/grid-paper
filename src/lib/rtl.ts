const RTL_CHAR_PATTERN = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/

export function isRTLText(str: string): boolean {
  return RTL_CHAR_PATTERN.test(str)
}
