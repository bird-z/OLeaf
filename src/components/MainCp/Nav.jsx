import CardNav from "../CardNav";
import logo from "../../assets/logo2.png";

function Nav() {
  return (
    <CardNav
      logo={logo}
      logoAlt="EcoRem · 江农学生协会"
      items={[
        { label: 'Academic', links: [
          { label: 'API', href: 'http://localhost:3000', ariaLabel: 'EcoRem API 中转站控制台' },
          { label: 'Research', href: '#', ariaLabel: 'View activity' },
          { label: 'Publications', href: '#', ariaLabel: 'View activity' },
        ]},
        { label: 'Services', links: [
          { label: 'Science | 科学与工程', href: '/science', ariaLabel: '科学与工程' },
          { label: 'Acknowledgment | 知识普及', href: '/popular', ariaLabel: '知识普及' },
          { label: 'Events | 教育活动', href: '/events', ariaLabel: '教育活动' },
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
