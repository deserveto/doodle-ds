import { useState, type ComponentType } from "react";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BellStickerIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FolderIcon,
  HeartStickerIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LightbulbStickerIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  SmileStickerIcon,
  StarIcon,
  StarStickerIcon,
  SunIcon,
  ThumbsUpStickerIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  XCircleIcon,
} from "@sangui/icons";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
  Clock,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  Folder,
  Heart,
  Home,
  Image,
  Info,
  Lightbulb,
  Lock,
  Mail,
  Menu,
  Minus,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Smile,
  Star,
  Sun,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Modal,
  Progress,
  Radio,
  Select,
  Switch,
  TabPanel,
  Tabs,
  Tag,
  Textarea,
  Tooltip,
} from "@sangui/ui";
import { DoodleArrow, DoodleStar, Section, Demo } from "../decor";

export function Components() {
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);
  const [tab, setTab] = useState("doodles");
  const [modal, setModal] = useState(false);
  const [tags, setTags] = useState(["zine", "collage", "sticker"]);

  return (
    <>
      <Section id="buttons" title="Button" kicker="solid pills, loud presses">
        <Demo title="variants">
          <Button>use doodles</Button>
          <Button variant="sun">try freebie</Button>
          <Button variant="terra">toast it</Button>
          <Button variant="sky">sky walk</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button disabled>disabled</Button>
        </Demo>
        <Demo title="sizes + icons">
          <Button size="sm">small</Button>
          <Button size="md">medium</Button>
          <Button size="lg">big energy</Button>
          <Button variant="sun" size="lg">
            <DoodleStar className="h-5 w-5" /> with icon
          </Button>
        </Demo>
      </Section>

      <Section id="badges" title="Badge & Tag" kicker="stickers + tape">
        <Demo title="badge shapes — pill, wobbly, tape">
          <Badge tone="ink">new!</Badge>
          <Badge tone="sun" shape="wobbly">
            try freebie
          </Badge>
          <Badge tone="terra" shape="wobbly">
            hot take
          </Badge>
          <Badge tone="sky">v1.0</Badge>
          <Badge tone="lavender" shape="tape">
            taped on
          </Badge>
          <Badge tone="sun" shape="tape">
            sale
          </Badge>
        </Demo>
        <Demo title="tags — removable, with dot">
          {tags.map((t) => (
            <Tag
              key={t}
              onRemove={() => setTags(tags.filter((x) => x !== t))}
              tone={t === "zine" ? "terra" : t === "collage" ? "sky" : "mint"}
            >
              {t}
            </Tag>
          ))}
          <Tag tone="ink" dot>
            status
          </Tag>
          {tags.length === 0 && (
            <Button size="sm" variant="outline" onClick={() => setTags(["zine", "collage", "sticker"])}>
              restock stickers
            </Button>
          )}
        </Demo>
      </Section>

      <Section id="cards" title="Card" kicker="cutouts, tape, tilt">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card tilt={-1}>
            <CardHeader>
              <CardTitle>Cutout card</CardTitle>
              <CardDescription>2px ink border, hard shadow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg-soft">
                Photos belong in pills and circles — never plain rectangles.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="sun">
                clip it
              </Button>
            </CardFooter>
          </Card>
          <Card tape tilt={1.5} tone="sun">
            <CardHeader>
              <CardTitle>Taped + tilted</CardTitle>
              <CardDescription className="text-ink/70">
                Collage energy: tape strips, slight rotation.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <DoodleArrow className="absolute -top-2 right-4 h-16 w-20 rotate-12 text-ink" />
              <p className="text-sm text-ink/80">
                Continuous line-art arrows point from words to anchors.
              </p>
            </CardContent>
          </Card>
          <Card tone="sky">
            <CardHeader>
              <CardTitle>Colorway card</CardTitle>
              <CardDescription className="text-ink/70">
                Tinted surfaces for focal moments.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar fallback="AB" tone="lavender" />
              <Avatar shape="pill" fallback="CD" tone="mint" />
              <Avatar shape="pill" fallback="EF" tone="terra" size="lg" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section id="forms" title="Forms" kicker="grounded, legible">
        <Demo title="input, textarea, select">
          <Input placeholder="your best idea…" className="max-w-xs" />
          <Input invalid defaultValue="broken stuff" className="max-w-xs" />
          <Textarea placeholder=" scribble notes here…" className="max-w-xs" />
          <Select defaultValue="a" className="max-w-xs">
            <option value="a">sunshine yellow</option>
            <option value="b">terracotta</option>
            <option value="c">sky blue</option>
          </Select>
        </Demo>
        <Demo title="checkbox, radio, switch">
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
            add googly eyes
          </Checkbox>
          <Checkbox defaultChecked={false}>add glitter</Checkbox>
          <fieldset className="flex items-center gap-4">
            <Radio name="vibe" defaultChecked>
              playful
            </Radio>
            <Radio name="vibe">extra playful</Radio>
          </fieldset>
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
          <span className="font-hand text-lg">{switchOn ? "chaos on" : "chaos off"}</span>
        </Demo>
      </Section>

      <Section id="feedback" title="Alert & Progress" kicker="say it loud">
        <div className="grid gap-6 lg:grid-cols-2">
          <Alert tone="warning" title="Heads up, maker!">
            This sticker sheet self-destructs in 5 seconds. Probably not, but
            alarms are fun.
          </Alert>
          <Alert tone="success" title="Zine published">
            Your cutout collage is live and looking delightfully imperfect.
          </Alert>
          <Alert tone="info" title="Sketch saved">
            Draft stored in the margin of notebook page 42.
          </Alert>
          <Alert tone="danger" title="Glue stick empty">
            Collage interrupted. Locate emergency glitter reserves.
          </Alert>
        </div>
        <Demo title="progress — striped, hard shadow">
          <div className="w-full space-y-3">
            <Progress value={72} label="collage progress" />
            <Progress value={45} tone="sky" label="sketch progress" />
            <Progress value={90} tone="terra" label="sticker progress" />
          </div>
        </Demo>
      </Section>

      <Section id="nav" title="Tabs & Tooltip" kicker="point at things">
        <div>
          <Tabs
            items={[
              { id: "doodles", label: "doodles" },
              { id: "collage", label: "collage" },
              { id: "zines", label: "zines" },
            ]}
            value={tab}
            onValueChange={setTab}
          >
            <TabPanel value="doodles">
              Radix marks the active trigger with data-state; we paint it with
              a squiggle underline.
            </TabPanel>
            <TabPanel value="collage">
              Overlapping shapes anchor visual weight — usually to the right.
            </TabPanel>
            <TabPanel value="zines">
              Print-inspired: fold, cut, staple, repeat.
            </TabPanel>
          </Tabs>
        </div>
        <Demo title="tooltip — wobbly speech bubble">
          <Tooltip content="hand-drawn, no blur">
            <Button variant="outline">hover me</Button>
          </Tooltip>
          <Tooltip content="I appear below" side="bottom">
            <Button variant="sun">or me</Button>
          </Tooltip>
        </Demo>
      </Section>

      <Section id="overlay" title="Modal" kicker="stamped + sealed">
        <Demo title="pop-in dialog with tape header">
          <Button onClick={() => setModal(true)}>open the thing</Button>
        </Demo>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="Cut, paste, repeat?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(false)}>
                not today
              </Button>
              <Button
                variant="sun"
                onClick={() => {
                  setModal(false);
                }}
              >
                let's collage
              </Button>
            </>
          }
        >
          Modals land with a springy pop-in, hard shadow, and a hand-written
          tape label. Escape and overlay clicks both close it.
        </Modal>
      </Section>
      <Section id="icons" title="Icons — Scribbles" kicker="wobbly vs. smooth">
        <Demo title="tiers 0–4 at 16 / 24 / 32px — wobble must read intentional">
          {(
            [
              ["close", CloseIcon, X],
              ["check", CheckIcon, Check],
              ["chevron-down", ChevronDownIcon, ChevronDown],
              ["search", SearchIcon, Search],
              ["star", StarIcon, Star],
              ["chevron-up", ChevronUpIcon, ChevronUp],
              ["chevron-left", ChevronLeftIcon, ChevronLeft],
              ["chevron-right", ChevronRightIcon, ChevronRight],
              ["arrow-right", ArrowRightIcon, ArrowRight],
              ["plus", PlusIcon, Plus],
              ["minus", MinusIcon, Minus],
              ["info", InfoIcon, Info],
              ["alert-triangle", AlertTriangleIcon, TriangleAlert],
              ["check-circle", CheckCircleIcon, CircleCheck],
              ["x-circle", XCircleIcon, CircleX],
              ["sun", SunIcon, Sun],
              ["moon", MoonIcon, Moon],
              ["menu", MenuIcon, Menu],
              ["dots-horizontal", DotsHorizontalIcon, Ellipsis],
              ["external-link", ExternalLinkIcon, ExternalLink],
              ["copy", CopyIcon, Copy],
              ["trash", TrashIcon, Trash2],
              ["edit", EditIcon, Pencil],
              ["eye", EyeIcon, Eye],
              ["eye-off", EyeOffIcon, EyeOff],
              ["download", DownloadIcon, Download],
              ["upload", UploadIcon, Upload],
              ["calendar", CalendarIcon, Calendar],
              ["clock", ClockIcon, Clock],
              ["user", UserIcon, User],
              ["settings", SettingsIcon, Settings],
              ["star-sticker", StarStickerIcon, Star],
              ["heart-sticker", HeartStickerIcon, Heart],
              ["bell-sticker", BellStickerIcon, Bell],
              ["smile-sticker", SmileStickerIcon, Smile],
              ["lightbulb-sticker", LightbulbStickerIcon, Lightbulb],
              ["thumbs-up-sticker", ThumbsUpStickerIcon, ThumbsUp],
              ["mail", MailIcon, Mail],
              ["lock", LockIcon, Lock],
              ["image", ImageIcon, Image],
              ["folder", FolderIcon, Folder],
              ["refresh", RefreshIcon, RefreshCw],
              ["home", HomeIcon, Home],
            ] as [
              string,
              ComponentType<{ className?: string }>,
              ComponentType<{ size?: number }>,
            ][]
          ).map(([name, Doodle, Lucide]) => (
            <div key={name} className="rounded-xl border-2 border-line bg-bg-deep p-3 text-center">
              <div className="flex items-end justify-center gap-2 text-fg">
                <Doodle className="h-4 w-4" />
                <Doodle className="h-6 w-6" />
                <Doodle className="h-8 w-8" />
              </div>
              <p className="mt-2 font-display text-xs font-bold">{name}</p>
              <div className="mt-2 flex items-end justify-center gap-2 text-fg-mute/60">
                <Lucide size={16} />
                <Lucide size={24} />
                <Lucide size={32} />
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-mute">lucide</p>
            </div>
          ))}
        </Demo>
        <p className="max-w-xl text-sm text-fg-mute">
          Small row = ours, gray row = Lucide. Ours: 2px wobbly strokes on the
          same 24 grid. Flip checkboxes in{" "}
          <code className="rounded bg-bg-deep px-1 font-mono text-xs">packages/icons/ICONLIST.md</code>{" "}
          as tiers land.
        </p>
      </Section>
    </>
  );
}
