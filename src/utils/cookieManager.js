// Cookie utility - works on localhost and production

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const getCookieDomain = () => {
  if (isLocalhost) {
    return '';
  }
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // For shuchiai.com and subdomains, use .shuchiai.com
  if (parts.length > 2) {
    return `;Domain=.${parts.slice(-2).join('.')}`;
  } else if (parts.length === 2) {
    // For single domain like shuchiai.com
    return `;Domain=.${hostname}`;
  }
  
  return '';
};

export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const domain = getCookieDomain();
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  document.cookie = `${name}=${encodeURIComponent(stringValue)};${expires};path=/;${domain}SameSite=Lax`;
};

export const getCookie = (name) => {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(nameEQ)) {
      const value = decodeURIComponent(cookie.substring(nameEQ.length));
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  setCookie(name, '', -1);
};

export const clearAuthCookies = () => {
  deleteCookie('authToken');
  deleteCookie('authUser');
  deleteCookie('selectedPanel');
};

export const CookieManager = {
  setCookie,
  getCookie,
  deleteCookie,
  clearAuthCookies
};
