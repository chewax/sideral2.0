export default function ({ store, redirect }) {
  if (!store.state?.session?.user) {
    redirect('/sign-in')
  }
}