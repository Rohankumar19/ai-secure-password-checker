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
  
  // Improved dictionary check (common passwords)
  const commonPasswords = [
    "123456", "password", "qwerty", "admin", "welcome", "123456789",
    "12345678", "abc123", "football", "monkey", "letmein", "dragon",
    "baseball", "sunshine", "princess", "superman", "trustno1"
  ];
  
  // Check for exact matches and similar patterns
  for (const common of commonPasswords) {
    // Exact match
    if (password.toLowerCase() === common) {
      score -= 30;
      break;
    }
    
    // Similar pattern (common password + numbers)
    const commonWithNumbers = new RegExp(`^${common}\\d+$`, 'i');
    if (commonWithNumbers.test(password)) {
      score -= 25;
      break;
    }
  }
  
  // Check for simple leetspeak variations
  const leetPassword = password.toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a');
    
  for (const common of commonPasswords) {
    if (leetPassword.includes(common)) {
      score -= 20;
      break;
    }
  }
  
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

// Special characters to use in password strengthening - using more common ones for memorability
const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];

export function generateStrongPassword(userPassword: string): string {
  if (!userPassword || userPassword.length < 3) {
    // Generate a memorable password using a combination of words and numbers
    const words = [
      "secure", "shield", "guard", "protect", "defend", "safeguard",
      "fortress", "battle", "victory", "power", "strength", "mighty"
    ];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Capitalize first letter of each word for better memorability
    const capitalizedWord1 = word1.charAt(0).toUpperCase() + word1.slice(1);
    const capitalizedWord2 = word2.charAt(0).toUpperCase() + word2.slice(1);
    
    return `${capitalizedWord1}${specialChar}${number}${capitalizedWord2}`;
  }
  
  // If user provided a password, make it stronger while keeping it memorable
  let strengthened = userPassword;
  
  // Extract any words or patterns that might help with memorability
  const potentialWords = userPassword.match(/[a-zA-Z]{3,}/g) || [];
  const hasPattern = potentialWords.length > 0;
  
  // Step 1: If there's a word pattern, try to preserve it
  if (hasPattern) {
    // Capitalize the first letter of each word for better memorability
    for (const word of potentialWords) {
      if (word.length >= 3) {
        const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        // Only replace the exact word to avoid changing substrings of other words
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        strengthened = strengthened.replace(regex, capitalized);
      }
    }
  } else {
    // If no clear word pattern, capitalize first letter if it's lowercase
    if (/[a-z]/.test(strengthened[0])) {
      strengthened = strengthened[0].toUpperCase() + strengthened.slice(1);
    }
  }
  
  // Step 2: Replace some characters with special chars but only if pattern isn't clear
  if (!hasPattern) {
    // Simple leetspeak for character replacement, making it more memorable
    const leetReplacements: Record<string, string> = {
      'a': '@',
      'e': '3',
      'i': '!',
      'o': '0',
      's': '$'
    };
    
    // Only replace one or two characters to keep it memorable
    let replacements = 0;
    let newStr = '';
    
    for (let i = 0; i < strengthened.length && replacements < 2; i++) {
      const char = strengthened[i].toLowerCase();
      if (leetReplacements[char] && Math.random() > 0.5 && replacements < 2) {
        newStr += leetReplacements[char];
        replacements++;
      } else {
        newStr += strengthened[i];
      }
    }
    
    if (replacements > 0) {
      strengthened = newStr;
    }
  }
  
  // Step 3: Add a memorable number (year or simple pattern)
  // Check if password already has a number
  if (!/\d/.test(strengthened)) {
    const currentYear = new Date().getFullYear();
    const memorableNumbers = [
      currentYear.toString(), 
      (currentYear % 100).toString(), 
      "123", 
      "777", 
      "999", 
      "111", 
      "2023", 
      "2024"
    ];
    const numberToAdd = memorableNumbers[Math.floor(Math.random() * memorableNumbers.length)];
    strengthened += numberToAdd;
  }
  
  // Step 4: Add a memorable special character if not present
  if (!/[^A-Za-z0-9]/.test(strengthened)) {
    const memorableSpecialChars = ['!', '@', '#', '$'];
    const specialChar = memorableSpecialChars[Math.floor(Math.random() * memorableSpecialChars.length)];
    
    // Add the special character in a position that makes sense (after a word, before a number)
    // This makes it more memorable by following patterns people expect
    const numberIndex = strengthened.search(/\d/);
    
    if (numberIndex > 0 && numberIndex < strengthened.length - 1) {
      // Insert before the first number
      strengthened = strengthened.slice(0, numberIndex) + specialChar + strengthened.slice(numberIndex);
    } else {
      // Add to the end
      strengthened += specialChar;
    }
  }
  
  // Step 5: Ensure minimum length of 10 characters
  if (strengthened.length < 10) {
    const shortWords = ["now", "yes", "win", "top", "max", "pro"];
    const word = shortWords[Math.floor(Math.random() * shortWords.length)];
    strengthened += word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  // Ensure the password has at least one uppercase, lowercase, number, and special character
  let hasUpper = /[A-Z]/.test(strengthened);
  let hasLower = /[a-z]/.test(strengthened);
  let hasNumber = /[0-9]/.test(strengthened);
  let hasSpecial = /[^A-Za-z0-9]/.test(strengthened);
  
  if (!hasUpper) strengthened = strengthened.charAt(0).toUpperCase() + strengthened.slice(1);
  if (!hasLower && strengthened.length > 1) strengthened = strengthened.charAt(0) + strengthened.charAt(1).toLowerCase() + strengthened.slice(2);
  if (!hasNumber) strengthened += '7';
  if (!hasSpecial) strengthened += '!';
  
  return strengthened;
}

// Check if password contains personal data - improved to catch more patterns
export function checkAgainstPersonalData(password: string, userData: any): string[] {
  const issues: string[] = [];
  const lowercasePassword = password.toLowerCase();
  
  // Check against name - improved to catch variations
  if (userData.fullName) {
    const nameParts = userData.fullName.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 2 && lowercasePassword.includes(part)) {
        issues.push(`Password contains part of your name: "${part}"`);
        break;
      }
      
      // Check for name backwards
      const reversedPart = part.split('').reverse().join('');
      if (part.length > 3 && lowercasePassword.includes(reversedPart)) {
        issues.push(`Password contains your name reversed: "${reversedPart}"`);
        break;
      }
    }
  }
  
  // Check against email - improved patterns
  if (userData.email) {
    const emailUsername = userData.email.toLowerCase().split('@')[0];
    const emailParts = emailUsername.split('.');
    
    // Check full username
    if (emailUsername.length > 3 && lowercasePassword.includes(emailUsername)) {
      issues.push(`Password contains your email username: "${emailUsername}"`);
    } else {
      // Check email parts
      for (const part of emailParts) {
        if (part.length > 2 && lowercasePassword.includes(part)) {
          issues.push(`Password contains part of your email: "${part}"`);
          break;
        }
      }
    }
    
    // Check domain name as well
    if (userData.email.includes('@')) {
      const domain = userData.email.split('@')[1].split('.')[0].toLowerCase();
      if (domain.length > 3 && lowercasePassword.includes(domain)) {
        issues.push(`Password contains your email domain: "${domain}"`);
      }
    }
  }
  
  // Check against birth date - improved to catch more date formats
  if (userData.dateOfBirth) {
    const date = new Date(userData.dateOfBirth);
    const year = date.getFullYear().toString();
    const shortYear = year.slice(2); // Last two digits of year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Check year patterns
    if (lowercasePassword.includes(year)) {
      issues.push(`Password contains your birth year: "${year}"`);
    } else if (lowercasePassword.includes(shortYear)) {
      issues.push(`Password contains your birth year: "${shortYear}"`);
    }
    
    // Check various date formats
    const dateFormats = [
      `${month}${day}`,
      `${day}${month}`,
      `${month}-${day}`,
      `${day}-${month}`,
      `${month}/${day}`,
      `${day}/${month}`,
      `${month}.${day}`,
      `${day}.${month}`
    ];
    
    for (const format of dateFormats) {
      if (lowercasePassword.includes(format)) {
        issues.push(`Password contains your birth date: "${format}"`);
        break;
      }
    }
    
    // Check for birth year + month/day combination
    const yearMonthDay = `${year}${month}${day}`;
    const dayMonthYear = `${day}${month}${year}`;
    if (lowercasePassword.includes(yearMonthDay) || lowercasePassword.includes(dayMonthYear)) {
      issues.push(`Password contains your full birth date`);
    }
  }
  
  // Check against expanded list of common leaked passwords
  const commonLeakedPasswords = [
    "123456", "password", "123456789", "12345678", "12345", "qwerty", 
    "1234567", "111111", "1234567890", "123123", "admin", "letmein", 
    "welcome", "monkey", "login", "abc123", "starwars", "dragon", 
    "passw0rd", "master", "hello", "freedom", "whatever", "qazwsx",
    "trustno1", "baseball", "jennifer", "superman", "iloveyou", "princess",
    "adobe123", "football", "123qwe", "sunshine", "654321", "pass", 
    "shadow", "michael", "121212", "hottie", "bailey", "daniel"
  ];
  
  // Improved check for leaked passwords
  for (const leaked of commonLeakedPasswords) {
    if (lowercasePassword === leaked) {
      issues.push(`Password is in the list of commonly leaked passwords: "${leaked}"`);
      break;
    }
    
    // Check for simple variations of common passwords
    if ((leaked.length > 4) && 
        (lowercasePassword.startsWith(leaked) || 
         lowercasePassword.endsWith(leaked) || 
         lowercasePassword.includes(leaked))) {
      issues.push(`Password contains a common leaked password pattern: "${leaked}"`);
      break;
    }
  }
  
  return issues;
}

// Hashcat simulation data for different GPUs and attack modes
const hashcatBenchmarks = {
  // Speeds in hashes per second for different hash types and GPUs
  // Based on real-world Hashcat benchmarks
  "rtx3090": {
    "md5": 70_000_000_000,    // 70 GH/s
    "sha256": 2_500_000_000,   // 2.5 GH/s
    "bcrypt": 23_000          // 23 KH/s
  },
  "rtx2080": {
    "md5": 33_000_000_000,    // 33 GH/s
    "sha256": 1_200_000_000,   // 1.2 GH/s
    "bcrypt": 12_000          // 12 KH/s
  },
  "gtx1080": {
    "md5": 25_000_000_000,    // 25 GH/s
    "sha256": 800_000_000,     // 800 MH/s
    "bcrypt": 8_000           // 8 KH/s
  }
};

// Attack modes simulation data - improved with better explanations and time calculations
const attackModes = [
  {
    name: "Brute Force",
    description: "Tries every possible combination of characters",
    effectivenessVsStrength: (strength: number) => strength >= 70 ? "Low" : "High",
    timeMultiplier: (strength: number) => Math.pow(10, strength / 10),
    icon: "zap"
  },
  {
    name: "Dictionary Attack",
    description: "Uses lists of common words and passwords",
    effectivenessVsStrength: (strength: number) => {
      // Dictionary attacks are very effective against weak passwords
      // and become less effective as password strength increases
      if (strength < 40) return "Very High";
      if (strength < 60) return "Medium";
      return "Low";
    },
    timeMultiplier: (strength: number) => {
      // Dictionary attacks are fast for common passwords but slow for strong ones
      if (strength < 30) return 1; // Instant for very weak passwords
      if (strength < 50) return Math.pow(10, 2); // Medium for weak passwords
      return Math.pow(10, strength / 15); // Grows slower than brute force for stronger passwords
    },
    icon: "book"
  },
  {
    name: "Rainbow Table",
    description: "Uses precomputed tables to crack password hashes",
    effectivenessVsStrength: (strength: number) => {
      if (strength < 30) return "Very High";
      if (strength < 50) return "High";
      if (strength < 70) return "Medium";
      return "Low";
    },
    timeMultiplier: (strength: number) => {
      // Rainbow tables are very effective on simple passwords
      if (strength < 40) return Math.pow(10, 1);
      return Math.pow(10, strength / 15);
    },
    icon: "table"
  },
  {
    name: "Hybrid Attack",
    description: "Combines dictionary words with patterns and special characters",
    effectivenessVsStrength: (strength: number) => {
      if (strength < 50) return "High";
      if (strength < 75) return "Medium";
      return "Low";
    },
    timeMultiplier: (strength: number) => {
      // Hybrid attacks are more effective than pure brute force on medium-strength passwords
      if (strength < 60) return Math.pow(10, strength / 15);
      return Math.pow(10, strength / 12);
    },
    icon: "combine"
  }
];

// Simulate Hashcat password cracking times with different attack methods and GPUs
export function simulateHashcatCrack(password: string, strength: number) {
  const passwordLength = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  // Calculate character space size based on character types used
  let charSpaceSize = 0;
  if (hasLower) charSpaceSize += 26;
  if (hasUpper) charSpaceSize += 26;
  if (hasNumber) charSpaceSize += 10;
  if (hasSpecial) charSpaceSize += 33; // Common special characters
  
  // Calculate combinations (conservative estimate)
  const combinations = Math.pow(Math.max(charSpaceSize, 1), passwordLength);
  
  // Calculate results for each GPU and hash algorithm
  const results = {
    gpus: Object.keys(hashcatBenchmarks).map(gpu => {
      const gpuData = hashcatBenchmarks[gpu as keyof typeof hashcatBenchmarks];
      
      return {
        name: gpu.toUpperCase(),
        algorithms: [
          {
            name: "MD5 (Unsafe)",
            timeInSeconds: combinations / gpuData.md5
          },
          {
            name: "SHA-256",
            timeInSeconds: combinations / gpuData.sha256
          },
          {
            name: "bcrypt",
            timeInSeconds: combinations / gpuData.bcrypt
          }
        ]
      };
    }),
    attackModes: attackModes.map(mode => {
      return {
        ...mode,
        effectiveness: mode.effectivenessVsStrength(strength),
        estimatedTime: formatTimeString(mode.timeMultiplier(strength))
      };
    })
  };
  
  return results;
}

// Calculate time to crack based on password strength
export function calculateTimeToCrack(password: string, strength: number): {
  regular: string;
  fastComputer: string;
  superComputer: string;
  hashcatResults?: ReturnType<typeof simulateHashcatCrack>;
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
  
  // Add hashcat simulation results
  const hashcatResults = simulateHashcatCrack(password, strength);
  
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
    superComputer: formatTimeString(secondsToCrack / 1000000), // Supercomputer is ~1,000,000 times faster
    hashcatResults
  };
}

// Format time string - this function is used in multiple places so we keep it separate
export function formatTimeString(seconds: number): string {
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
}
