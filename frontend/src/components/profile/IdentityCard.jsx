import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'

/**
 * IdentityCard — the Profile page's "Student identity" card
 * (design 60:9075 desktop, 60:8230 mobile).
 *
 * Desktop: one 100px row — a 52px identity block on the left, a fixed 150px
 * "Edit Profile" action hard right. Mobile: the action drops below and spans
 * the card (both stacks are 20px-padded rather than 24px).
 */
export default function IdentityCard({ name, avatar }) {
  return (
    <Card className="flex w-full flex-col gap-5 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
      <div className="flex min-w-px flex-1 items-center gap-4">
        <Avatar name={name} src={avatar} size={52} />
        <div className="flex min-w-px flex-1 flex-col gap-0.5 leading-[1.5]">
          <p className="truncate text-[22px] font-semibold text-[#17191f]">{name}</p>
          <p className="text-[11px] font-normal text-[#686b73]">Name and avatar</p>
        </div>
      </div>

      <Button as={Link} to="/profile/edit" className="w-full shrink-0 md:w-[150px]">
        Edit Profile
      </Button>
    </Card>
  )
}
