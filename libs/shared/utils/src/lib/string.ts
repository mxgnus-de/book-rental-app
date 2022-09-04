export function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateUid(length: number): string {
   let uid = '';
   const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
      uid += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return uid;
}

export default function shortString(str: string, max = 50): string {
   if (str.length > max) {
      return str.substring(0, max) + '...';
   }

   return str;
}
