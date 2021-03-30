import { Button, Divider, Grid, Text, Tooltip } from '@geist-ui/react'
import styles from '../styles/Home.module.css'

const MockItem = () => <div className="footer-nav-bar">
  <Text h4>Support</Text>
  <a href="#">About</a>
  <a href="#">Suggestion</a>
  <a href="#">FAQ</a>
</div>

export function Footer() {
    return <footer className={styles.footer}>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} md={6}><MockItem /></Grid>
          <Grid xs={12} md={6}><MockItem /></Grid>
          <Grid xs={12} md={6}><MockItem /></Grid>
        </Grid.Container>
        <Divider />
        <Grid.Container gap={2} justify="space-around">
          <Grid xs={24} md={6}><Text size={14}>Meta Network All Right Reserved.</Text></Grid>
          <Grid xs={24} md={4} style={{ float: 'right' }}>
            <div className="i18n-switch">
              <Tooltip text={<>
                <Button auto size="small">中文</Button>
                <Button auto size="small">日本语</Button>
                <Button auto size="small">English</Button>
                </>}>English</Tooltip>
            </div>
          </Grid>
        </Grid.Container>
      </footer>
}