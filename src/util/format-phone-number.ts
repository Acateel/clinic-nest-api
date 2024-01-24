/**
 * Convert phone number in format: +XXXXXXXX
 */
export const formatPhoneNumber = (phoneNumber: string) => {
    var cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length >= 8) {
      return `+${cleaned}`
    }
    return null
  }
  