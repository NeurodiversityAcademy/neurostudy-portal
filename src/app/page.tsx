import styles from './page.module.css'
import ButtonDisplay from './components/buttons/ButtonDisplay'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Site under construction</h1>
      </div>
      <div>    
        <ButtonDisplay></ButtonDisplay>
      </div>
    </main>
  )
}
