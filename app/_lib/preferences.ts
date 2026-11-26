export const THEME_STORAGE_KEY = "portfolio-theme";
export const LANGUAGE_STORAGE_KEY = "portfolio-language";

/**
 * Se ejecuta en <head> antes del primer pintado: deja en <html> la clase del
 * tema y el idioma guardados (o los del sistema), para que no haya parpadeo
 * ni desajuste entre lo que renderiza el servidor y lo que ve el cliente.
 */
export const preferencesScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.toggle("dark",t==="dark");var l=localStorage.getItem("${LANGUAGE_STORAGE_KEY}");if(l!=="es"&&l!=="en"){l=(navigator.language||"es").slice(0,2)==="en"?"en":"es"}d.lang=l}catch(e){}})();`;
