export function sliceTextContent(text: string, numChars: number) {
    if(text.length > numChars) {
        return text.slice(0, numChars) + '...';
    }
    return text;
}


export function formatNumber(n: number): string {
    return Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n);
}


export function isUtcIsoDate(isoDate: string): boolean {
    return isoDate.endsWith("Z") || isoDate.includes("+00:00");
}


export function isSameDateAsToday(isoDate: string): boolean {
    const input = new Date(isoDate);
    const now = new Date();

    if(isUtcIsoDate(isoDate)) {
        return (
            input.getUTCFullYear() === now.getUTCFullYear() &&
            input.getUTCMonth() === now.getUTCMonth() &&
            input.getUTCDate() === now.getUTCDate()
        );
    }

    return (
        input.getFullYear() === now.getFullYear() &&
        input.getMonth() === now.getMonth() &&
        input.getDate() === now.getDate()
    );
}


export function formatRelativeTime(isoDate?: string): string {
    if (!isoDate) return "Unknown";

    const date = new Date(isoDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    // const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    // return `${days} day${days !== 1 ? 's' : ''} ago`;

    // Format date for older values
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    return date.toLocaleDateString(undefined, options); // Uses user locale
}


export function formatIsoDate(isoDate: string): string {
    if(isSameDateAsToday(isoDate)) return formatRelativeTime(isoDate);

    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Months are 0-indexed
    const day = `${date.getDate()}`.padStart(2, '0');

    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}



export function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
            size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    };
}



export function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}
