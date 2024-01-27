/**
 * Convert phone number in format: +XXXXXXXX
 */
export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber) {
    var cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length >= 8) {
      return `+${cleaned}`
    }
  }
  return null
}
