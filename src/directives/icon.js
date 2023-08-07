export default {
  beforeMount(el, binding) {
    let iconClass = `far fa-${binding.value.icon} text-xl order-1`

    if (binding.value.fill) {
      iconClass = `fas fa-${binding.value.icon} text-x1 order-1`
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
