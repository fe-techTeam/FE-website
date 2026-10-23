import { LinkedInIcon } from "@/components/SocialIcons";
import { PortraitSlot } from "@/components/media/AssetPlaceholder";
import { aboutTeam } from "@/content/about";

export default function TeamCarousel() {
  return (
    <ul
      data-animate-stagger
      className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
      aria-label="Leadership team"
    >
      {aboutTeam.map((member) => {
        const [firstName, ...restName] = member.name.split(" ");
        const lastName = restName.join(" ");
        const body = (
          <>
            <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#161616]">
              <PortraitSlot
                asset={{ ...member.image, alt: "" }}
                name={member.name}
                className="h-full w-full [&_img]:transition [&_img]:duration-500 group-hover:[&_img]:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            <div className="relative flex min-h-[5.25rem] flex-1 items-start justify-between gap-3 px-4 py-4 sm:min-h-[5.75rem] sm:px-5 sm:py-5">
              <div className="min-w-0 w-full sm:flex-1 sm:w-auto">
                <h3 className="m-0 pr-12 font-display text-[1.05rem] leading-[1.12] font-bold tracking-[0.02em] text-ink uppercase sm:pr-0 sm:text-[1.15rem] sm:whitespace-nowrap">
                  {firstName}
                  {lastName ? (
                    <>
                      <br className="sm:hidden" />
                      <span className="hidden sm:inline"> </span>
                      {lastName}
                    </>
                  ) : null}
                </h3>
                <p className="mt-1.5 mb-0 w-full text-[13px] leading-snug text-muted">{member.title}</p>
              </div>

              <span
                className="absolute top-4 right-4 mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-full border-[1.5px] border-[#e8a0a0] text-ink transition duration-200 group-hover:border-red group-hover:bg-red group-hover:text-white sm:static sm:top-auto sm:right-auto"
                aria-hidden
              >
                <LinkedInIcon size={15} />
              </span>
            </div>
          </>
        );

        const cardClassName =
          "group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/15 bg-white text-ink shadow-[0_14px_44px_rgba(0,0,0,0.45)] transition duration-200 hover:border-red/50 hover:shadow-[0_18px_48px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:rounded-[22px]";

        return (
          <li key={member.name} className="min-w-0">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className={cardClassName}
                aria-label={`${member.name}, ${member.title}. LinkedIn (opens in a new tab)`}
              >
                {body}
              </a>
            ) : (
              <article className={cardClassName} aria-label={`${member.name}, ${member.title}`}>
                {body}
              </article>
            )}
          </li>
        );
      })}
    </ul>
  );
}
