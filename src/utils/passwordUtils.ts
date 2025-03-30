
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

export function generateStrongPassword(userPassword: string): string {
  // Use parts of the user's password if possible (to make it more memorable)
  // but strengthen it significantly
  
  if (!userPassword) return "StrongP@ss123!";
  
  // Extract any letters from the user password
  const letters = userPassword.match(/[a-zA-Z]+/g) || [];
  const firstWordPart = letters.length ? letters[0].substring(0, 4) : "Pass";
  
  // Capitalize the first letter to ensure uppercase
  const capitalizedPart = firstWordPart.charAt(0).toUpperCase() + firstWordPart.slice(1);
  
  // Add numbers and special characters
  const numbers = Math.floor(Math.random() * 900 + 100).toString(); // 3-digit number
  const specialChars = ["!", "@", "#", "$", "%", "&", "*"];
  const specialChar1 = specialChars[Math.floor(Math.random() * specialChars.length)];
  const specialChar2 = specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Create a strong password using parts of the user's input but much stronger
  return `${capitalizedPart}${specialChar1}${numbers}${specialChar2}`;
}
