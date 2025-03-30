
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length contribution (up to 30 points)
  const lengthScore = Math.min(30, password.length * 2);
  score += lengthScore;
  
  // Character variety (up to 40 points)
  if (/[A-Z]/.test(password)) score += 10; // Uppercase
  if (/[a-z]/.test(password)) score += 10; // Lowercase
  if (/[0-9]/.test(password)) score += 10; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 10; // Special chars
  
  // Complexity patterns (up to 30 points)
  const hasVariety = (/[A-Z]/.test(password) ? 1 : 0) +
                     (/[a-z]/.test(password) ? 1 : 0) +
                     (/[0-9]/.test(password) ? 1 : 0) +
                     (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  
  score += hasVariety * 7.5; // Up to 30
  
  // Penalize common patterns
  if (/(.)\1\1/.test(password)) score -= 10; // Repeating characters
  if (/^(password|admin|123456|qwerty)$/i.test(password)) score -= 30; // Common passwords
  if (/^[0-9]+$/.test(password)) score -= 15; // Only numbers
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Leetspeak conversion map
const leetMap: Record<string, string> = {
  'a': '4',
  'e': '3',
  'i': '1',
  'o': '0',
  's': '5',
  't': '7',
  'b': '8',
  'g': '9',
  'l': '1'
};

// Special characters to use in password strengthening
const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?', '+', '=', '^', '~'];

export function generateStrongPassword(userPassword: string): string {
  if (!userPassword || userPassword.length < 3) {
    return "Str0ng#P@ss!23";
  }
  
  // Step 1: Apply leetspeak conversion
  let strengthened = userPassword.split('').map(char => {
    // 70% chance to convert applicable characters to leetspeak
    if (leetMap[char.toLowerCase()] && Math.random() > 0.3) {
      return leetMap[char.toLowerCase()];
    }
    
    // 50% chance to uppercase letters
    if (/[a-z]/.test(char) && Math.random() > 0.5) {
      return char.toUpperCase();
    }
    
    return char;
  }).join('');
  
  // Step 2: Add special characters at random positions
  // Insert 1-3 special characters
  const numSpecialChars = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numSpecialChars; i++) {
    const position = Math.floor(Math.random() * (strengthened.length + 1));
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    strengthened = strengthened.slice(0, position) + specialChar + strengthened.slice(position);
  }
  
  // Step 3: Enhance length and uniqueness if needed
  if (strengthened.length < 12) {
    // Add random characters to reach minimum length of 12
    const additionalLength = 12 - strengthened.length;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let extraChars = '';
    for (let i = 0; i < additionalLength; i++) {
      extraChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    strengthened += extraChars;
  }
  
  // Ensure the password has at least one uppercase, lowercase, number, and special character
  let hasUpper = /[A-Z]/.test(strengthened);
  let hasLower = /[a-z]/.test(strengthened);
  let hasNumber = /[0-9]/.test(strengthened);
  let hasSpecial = /[^A-Za-z0-9]/.test(strengthened);
  
  if (!hasUpper) strengthened += 'Q';
  if (!hasLower) strengthened += 'q';
  if (!hasNumber) strengthened += '7';
  if (!hasSpecial) strengthened += '#';
  
  return strengthened;
}

// Example transformation for "Summer2024" would produce something like "5uMM3r#2024*Q"
