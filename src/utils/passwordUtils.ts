
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
  if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Only letters
  
  // Check for keyboard patterns
  if (/qwert|asdfg|zxcvb|12345|09876/i.test(password)) score -= 15;
  
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
  
  // Step 1: Apply leetspeak conversion with higher probability
  let strengthened = userPassword.split('').map(char => {
    // 80% chance to convert applicable characters to leetspeak
    if (leetMap[char.toLowerCase()] && Math.random() > 0.2) {
      return leetMap[char.toLowerCase()];
    }
    
    // 60% chance to uppercase letters
    if (/[a-z]/.test(char) && Math.random() > 0.4) {
      return char.toUpperCase();
    }
    
    return char;
  }).join('');
  
  // Step 2: Add special characters at strategic positions
  // Insert 2-4 special characters
  const numSpecialChars = Math.floor(Math.random() * 3) + 2;
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

// Check if password contains personal data
export function checkAgainstPersonalData(password: string, userData: any): string[] {
  const issues: string[] = [];
  const lowercasePassword = password.toLowerCase();
  
  // Check against name
  if (userData.fullName) {
    const nameParts = userData.fullName.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 2 && lowercasePassword.includes(part)) {
        issues.push(`Password contains part of your name: "${part}"`);
        break;
      }
    }
  }
  
  // Check against email
  if (userData.email) {
    const emailParts = userData.email.toLowerCase().split('@')[0].split('.');
    for (const part of emailParts) {
      if (part.length > 2 && lowercasePassword.includes(part)) {
        issues.push(`Password contains part of your email: "${part}"`);
        break;
      }
    }
  }
  
  // Check against birth date
  if (userData.dateOfBirth) {
    const date = new Date(userData.dateOfBirth);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    if (lowercasePassword.includes(year)) {
      issues.push(`Password contains your birth year: "${year}"`);
    }
    
    const dateFormats = [
      `${month}${day}`,
      `${day}${month}`,
      `${month}-${day}`,
      `${day}-${month}`
    ];
    
    for (const format of dateFormats) {
      if (lowercasePassword.includes(format)) {
        issues.push(`Password contains your birth date: "${format}"`);
        break;
      }
    }
  }
  
  // Check against common leaked passwords (simplified for the exercise)
  const commonLeakedPasswords = [
    "123456", "password", "123456789", "12345678", "12345", "qwerty", 
    "1234567", "111111", "1234567890", "123123", "admin", "letmein", 
    "welcome", "monkey", "login", "abc123", "starwars", "dragon", 
    "passw0rd", "master", "hello", "freedom", "whatever", "qazwsx"
  ];
  
  for (const leaked of commonLeakedPasswords) {
    if (lowercasePassword === leaked) {
      issues.push(`Password is in the list of commonly leaked passwords: "${leaked}"`);
      break;
    }
  }
  
  return issues;
}

// Calculate time to crack based on password strength
export function calculateTimeToCrack(password: string, strength: number): {
  regular: string;
  fastComputer: string;
  superComputer: string;
} {
  // Base time calculation
  let secondsToCrack: number;
  
  if (strength < 20) {
    secondsToCrack = Math.pow(10, 1); // 10 seconds
  } else if (strength < 40) {
    secondsToCrack = Math.pow(10, 3); // ~ 15 minutes
  } else if (strength < 60) {
    secondsToCrack = Math.pow(10, 5); // ~ 1 day
  } else if (strength < 80) {
    secondsToCrack = Math.pow(10, 8); // ~ 3 years
  } else if (strength < 90) {
    secondsToCrack = Math.pow(10, 11); // ~ 3,000 years
  } else {
    secondsToCrack = Math.pow(10, 15); // Millions of years
  }
  
  // Adjust based on password length and complexity
  const lengthMultiplier = Math.max(1, Math.pow(2, password.length - 8));
  secondsToCrack *= lengthMultiplier;
  
  // Format the time string
  const formatTimeString = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} minutes`;
    } else if (seconds < 86400) {
      return `${Math.round(seconds / 3600)} hours`;
    } else if (seconds < 31536000) {
      return `${Math.round(seconds / 86400)} days`;
    } else if (seconds < 315360000) { // 10 years
      return `${Math.round(seconds / 31536000)} years`;
    } else if (seconds < 31536000000) { // 1000 years
      return `${Math.round(seconds / 31536000)} years`;
    } else {
      return "Millions of years";
    }
  };
  
  return {
    regular: formatTimeString(secondsToCrack),
    fastComputer: formatTimeString(secondsToCrack / 10000), // GPU cluster is ~10,000 times faster
    superComputer: formatTimeString(secondsToCrack / 1000000) // Supercomputer is ~1,000,000 times faster
  };
}
