import CardNav from "../CardNav";
import logo from "../../assets/logo2.png";

function Nav() {
  return (
    <CardNav
      logo={logo}
      logoAlt="EcoRem · 江农学生协会"
      items={[
        { label: 'Academic', links: [
          { label: 'API', href: '#', ariaLabel: 'Go to dashboard' },
          { label: 'Research', href: '#', ariaLabel: 'View activity' },
          { label: 'Publications', href: '#', ariaLabel: 'View activity' },
        ]},
        { label: 'Services', links: [
          { label: 'Science | 科学与工程', href: '#', ariaLabel: '' },
          { label: 'Acknowledgment | 知识普及', href: '#', ariaLabel: '知识普及' },
          { label: 'Events | 教育活动', href: '#', ariaLabel: 'View activity' },
        ]},
        { label: 'About', links: [
          { label: 'Team', href: '#', ariaLabel: 'Meet the team' },
          { label: 'Contact', href: '#', ariaLabel: 'Contact us' },
        ]},
      ]}
    />
  )
}

export default Nav
