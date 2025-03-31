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

// Simulate an attack based on attack type, password, and user data
export function simulateAttack(
  password: string, 
  userData: any, 
  attackType: string, 
  strength: number
): { cracked: boolean; method?: string } {
  const lowercasePassword = password.toLowerCase();
  
  // Common leaked passwords
  const commonLeakedPasswords = [
    "123456", "password", "123456789", "12345678", "12345", "qwerty", 
    "1234567", "111111", "1234567890", "123123", "admin", "letmein", 
    "welcome", "monkey", "login", "abc123", "starwars", "dragon", 
    "passw0rd", "master", "hello", "freedom", "whatever", "qazwsx"
  ];
  
  // RockYou.txt top passwords (simulation)
  const rockyouPasswords = [
    ...commonLeakedPasswords,
    "iloveyou", "princess", "rockyou", "1234", "12345", "baseball", 
    "football", "1qaz2wsx", "trustno1", "jennifer", "sunshine", "superman",
    "michael", "liverpool", "computer", "jessica", "pokemon", "michelle",
    "tigger", "angel", "qwertyuiop", "charlie", "zxcvbnm", "zaq1zaq1"
  ];
  
  // Dictionary attack simulation
  if (attackType === 'dictionary attack') {
    // Cracking probability based on password strength
    const dictionaryAttackProbability = Math.max(0, 100 - strength) / 100;
    
    // Check if password matches any in our simulated dictionary
    const isInDictionary = rockyouPasswords.includes(lowercasePassword);
    
    // For very weak passwords, directly check against common password lists
    if (isInDictionary || strength < 30) {
      return { 
        cracked: true, 
        method: "Found in leaked password database" 
      };
    }
    
    // Random chance of success based on strength to simulate larger dictionaries
    if (Math.random() < dictionaryAttackProbability * 0.5) {
      return { 
        cracked: true, 
        method: "Matched common password pattern" 
      };
    }
    
    return { cracked: false };
  }
  
  // Brute force attack simulation
  if (attackType === 'brute force attack') {
    // Check for patterns based on personal information
    if (userData.fullName) {
      const nameParts = userData.fullName.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (part.length > 2) {
          // Check for variations of name with numbers/special chars
          const nameRegexPatterns = [
            new RegExp(`${part}\\d+`),          // name followed by numbers
            new RegExp(`${part}[!@#$%^&*]`),    // name followed by special chars
            new RegExp(`\\d+${part}`),          // numbers followed by name
            new RegExp(`[!@#$%^&*]${part}`)     // special chars followed by name
          ];
          
          for (const regex of nameRegexPatterns) {
            if (regex.test(lowercasePassword)) {
              return { 
                cracked: true, 
                method: `Personal data pattern: ${part}+extra` 
              };
            }
          }
        }
      }
    }
    
    // Check for patterns based on birth date
    if (userData.dateOfBirth) {
      const date = new Date(userData.dateOfBirth);
      const year = date.getFullYear().toString();
      
      if (lowercasePassword.includes(year)) {
        return { 
          cracked: true, 
          method: `Pattern with birth year: ${year}` 
        };
      }
      
      // Common date formats
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      const dateFormats = [
        `${month}${day}`, `${day}${month}`, 
        `${month}${day}${year.slice(-2)}`, `${day}${month}${year.slice(-2)}`
      ];
      
      for (const format of dateFormats) {
        if (lowercasePassword.includes(format)) {
          return { 
            cracked: true, 
            method: `Pattern with date: ${format}` 
          };
        }
      }
    }
    
    // Check for patterns with email
    if (userData.email) {
      const emailParts = userData.email.toLowerCase().split('@')[0].split('.');
      for (const part of emailParts) {
        if (part.length > 2 && lowercasePassword.includes(part)) {
          return { 
            cracked: true, 
            method: `Pattern with email: ${part}` 
          };
        }
      }
    }
    
    // Check keyboard patterns
    const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvb', '12345', '09876'];
    for (const pattern of keyboardPatterns) {
      if (lowercasePassword.includes(pattern)) {
        return { 
          cracked: true, 
          method: `Keyboard pattern: ${pattern}` 
        };
      }
    }
    
    // Simple patterns
    if (/^[0-9]+$/.test(password)) {
      return { cracked: true, method: "Numbers only" };
    }
    
    if (/^[a-zA-Z]+$/.test(password)) {
      return { cracked: true, method: "Letters only" };
    }
    
    // Random chance of cracking based on password strength
    const bruteForceChance = Math.max(0, (80 - strength) / 100);
    if (Math.random() < bruteForceChance && password.length < 10) {
      return { cracked: true, method: "Brute force success" };
    }
    
    return { cracked: false };
  }
  
  // Rainbow table attack simulation
  if (attackType === 'rainbow table attack') {
    // Rainbow tables are most effective against unsalted hashes of common patterns
    // Simulate this by checking for common patterns with minor modifications
    
    // Common password patterns that might be in rainbow tables
    const commonPatterns = ['pass', 'admin', 'user', 'login', 'welcome', 'secret', 'secure'];
    
    for (const pattern of commonPatterns) {
      // Check for leetspeak variations
      const leetPattern = pattern
        .replace(/a/g, '4')
        .replace(/e/g, '3')
        .replace(/i/g, '1')
        .replace(/o/g, '0')
        .replace(/s/g, '5');
      
      if (lowercasePassword.includes(pattern) || lowercasePassword.includes(leetPattern)) {
        // Higher chance of cracking for shorter passwords
        const rainbowChance = Math.max(0, (70 - strength) / 100);
        if (Math.random() < rainbowChance || password.length < 9) {
          return { 
            cracked: true, 
            method: `Common pattern found: ${pattern}` 
          };
        }
      }
    }
    
    // For very short passwords, rainbow tables are highly effective
    if (password.length < 8 && strength < 60) {
      return { 
        cracked: true, 
        method: "Short password hash reversed" 
      };
    }
    
    // MD5 and unsalted SHA1 hashes are vulnerable
    // Simulate by giving a small chance for weak passwords
    if (strength < 40 && Math.random() < 0.3) {
      return { 
        cracked: true, 
        method: "Hash reversed via rainbow table" 
      };
    }
    
    return { cracked: false };
  }
  
  return { cracked: false };
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

// Attack modes simulation data
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
    effectivenessVsStrength: (strength: number) => strength >= 50 ? "Low" : "Very High",
    timeMultiplier: (strength: number) => Math.pow(10, strength / 20),
    icon: "book"
  },
  {
    name: "Rainbow Table",
    description: "Uses precomputed tables to crack password hashes",
    effectivenessVsStrength: (strength: number) => strength >= 60 ? "Low" : "High",
    timeMultiplier: (strength: number) => Math.pow(10, strength / 15),
    icon: "table"
  },
  {
    name: "Hybrid Attack",
    description: "Combines dictionary words with patterns and special characters",
    effectivenessVsStrength: (strength: number) => strength >= 80 ? "Low" : "Medium",
    timeMultiplier: (strength: number) => Math.pow(10, strength / 12),
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
