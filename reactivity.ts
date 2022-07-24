let activeEffect: Function | null = null

interface Ref<T> {
    value: T
}

export function watchEffect(f: Function): void {
    console.log('effect start', f)
    activeEffect = f
    activeEffect()
    activeEffect = null
    console.log('effect end', f)
}

type Target = object

const targetMap = new WeakMap<Target, Map<string, Set<Function>>>()

export function track(target: Target, key: string) {
    if (!activeEffect)
        return

    console.log('track ', key)

    let depsMap = targetMap.get(target)
    if (!depsMap)
        targetMap.set(target, (depsMap = new Map()))

    let dep = depsMap.get(key)
    if (!dep)
        depsMap.set(key, (dep = new Set()))

    dep.add(activeEffect)
}

export function trigger(target: Target, key: string) {
    const depsMap = targetMap.get(target)
    if (!depsMap)
        return

    const dep = depsMap.get(key)
    if (!dep)
        return

    console.log('trigger', key)

    dep.forEach(effect => effect())
}

export function ref<T>(raw?: T): Ref<T> {
    const r = {
        get value() {
            track(r, 'value')

            return raw
        },
        set value(newValue) {
            raw = newValue
            trigger(r, 'value')
        },
    }

    return r as Ref<T>
}

export function computed<T>(getter: ()=> T) {
    const result = ref<T>()
    watchEffect(() => result.value = getter())

    return result
}

export function reactive<T extends object>(target: T): T {
    return new Proxy<T>(target, {
        get(target: any, p: string, receiver: any): any {
            const result = Reflect.get(target, p, receiver)
            track(target, p)

            return result
        },
        set(target: any, p: string, value: any, receiver: any): boolean {
            const oldValue = target[p]
            const result = Reflect.set(target, p, value, receiver)
            if (result && oldValue !== value)
                trigger(target, p)

            return result
        },
    })
}
