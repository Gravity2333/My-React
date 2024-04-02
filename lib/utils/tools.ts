export function debounce(func, timeout) {
    let timer = null
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(null, args)
        }, timeout);
    }
}