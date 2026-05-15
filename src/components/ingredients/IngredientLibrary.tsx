/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { INGREDIENTS } from '../../data/ingredients';

const left = 25;
const right = 295;
const cy = 80;
const cpB = 136; // 80 + 140*0.4 (ry approximate bezier control point)
const cpT = 24; // 80 - 140*0.4

// --- Generic Helpers ---

const IsometricBase = ({
  thickness,
  front,
  top,
  specks,
}: {
  thickness?: number;
  front?: string;
  top?: string;
  specks?: React.ReactNode;
}) => (
  <g>
    {thickness > 0 && (
      <path
        d={`M ${left} ${cy} Q 160 ${cpB} ${right} ${cy} L ${right} ${cy + thickness} Q 160 ${cpB + thickness} ${left} ${cy + thickness} Z`}
        fill={front}
      />
    )}
    <path
      d={`M ${left} ${cy} Q 160 ${cpB} ${right} ${cy} Q 160 ${cpT} ${left} ${cy} Z`}
      fill={top}
    />
    {specks}
  </g>
);

const Dome = ({
  front,
  top,
  texture,
}: {
  front?: string;
  top?: string;
  texture?: React.ReactNode;
}) => (
  <g>
    <path
      d={`M ${left} ${cy} Q 160 ${cpB} ${right} ${cy} Q 160 -80 ${left} ${cy} Z`}
      fill={front}
    />
    <path
      d={`M ${left} ${cy} Q 160 ${cpB} ${right} ${cy} Q 160 -90 ${left} ${cy} Z`}
      fill={top}
      opacity={0.3}
    />
    {texture}
  </g>
);

const CheeseBase = ({
  fill,
  droopFill,
  holes,
  specks,
}: {
  fill: string;
  droopFill: string;
  holes?: React.ReactNode;
  specks?: React.ReactNode;
}) => (
  <g>
    <path d="M 40 80 L 160 40 L 280 80 L 190 120 L 40 80 Z" fill={fill} />
    <path d="M 40 80 L 190 120 L 180 140 L 30 90 Z" fill={droopFill} />
    <path d="M 280 80 L 190 120 L 200 145 L 290 90 Z" fill={droopFill} />
    {holes && (
      <g fill={droopFill} opacity={0.6}>
        <ellipse
          cx="110"
          cy="65"
          rx="8"
          ry="4"
          transform="rotate(-15 110 65)"
        />
        <ellipse
          cx="160"
          cy="55"
          rx="14"
          ry="6"
          transform="rotate(20 160 55)"
        />
        <ellipse
          cx="210"
          cy="75"
          rx="10"
          ry="5"
          transform="rotate(-10 210 75)"
        />
        <ellipse cx="140" cy="85" rx="7" ry="3" />
        <ellipse cx="240" cy="85" rx="6" ry="3" />
      </g>
    )}
    {specks}
  </g>
);

const SauceDrip = ({
  fill,
  droops,
}: {
  fill: string;
  droops: { x: number; y: number; w: number; h: number }[];
}) => (
  <g>
    <path
      d={`M 35 80 Q 160 125 285 80 Q 160 40 35 80 Z`}
      fill={fill}
      opacity={0.9}
    />
    {droops.map((d, i: number) => (
      <path
        key={i}
        d={`M ${d.x - d.w} ${d.y} Q ${d.x} ${d.y + d.h} ${d.x + d.w} ${d.y} Z`}
        fill={fill}
      />
    ))}
  </g>
);

// --- Meat Components ---
const BeefPatty = () => (
  <IsometricBase
    thickness={15}
    front="#4A2616"
    top="#6E3A21"
    specks={
      <g fill="#422213">
        <ellipse cx="80" cy="80" rx="3" ry="1.5" />
        <ellipse cx="140" cy="70" rx="4" ry="2" />
        <ellipse cx="200" cy="85" rx="3" ry="1" />
        <ellipse cx="240" cy="75" rx="2" ry="1" />
        <ellipse cx="100" cy="60" rx="3" ry="1.5" />
      </g>
    }
  />
);

const GrilledChicken = () => (
  <IsometricBase
    thickness={12}
    front="#A35E22"
    top="#D1893D"
    specks={
      <g
        fill="none"
        stroke="#8B4212"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      >
        <path d="M 80 60 L 70 100 M 130 55 L 120 105 M 180 50 L 170 105 M 230 55 L 220 95 270 60 L 260 85" />
      </g>
    }
  />
);

const CrispyChicken = () => (
  <IsometricBase
    thickness={16}
    front="#AD6520"
    top="#D98A36"
    specks={
      <g fill="#A85B17">
        <path d="M 40 80 Q 50 70 60 85 Q 70 70 80 80 ..." opacity="0.3" />
        {/* Simple bump simulation */}
        <circle cx="100" cy="65" r="5" />
        <circle cx="150" cy="55" r="7" />
        <circle cx="200" cy="65" r="6" />
        <circle cx="120" cy="90" r="4" />
        <circle cx="230" cy="80" r="5" />
        <circle cx="170" cy="95" r="6" />
      </g>
    }
  />
);

const BlackBeanPatty = () => (
  <IsometricBase
    thickness={14}
    front="#2E2218"
    top="#4A382A"
    specks={
      <g>
        {/* Dark bean halves — pressed into the surface */}
        <g fill="#1A0F08">
          <ellipse
            cx="80"
            cy="75"
            rx="6"
            ry="3"
            transform="rotate(-12 80 75)"
          />
          <ellipse
            cx="115"
            cy="62"
            rx="7"
            ry="3.5"
            transform="rotate(18 115 62)"
          />
          <ellipse
            cx="160"
            cy="55"
            rx="6"
            ry="3"
            transform="rotate(-8 160 55)"
          />
          <ellipse
            cx="210"
            cy="60"
            rx="7"
            ry="3.5"
            transform="rotate(22 210 60)"
          />
          <ellipse
            cx="245"
            cy="78"
            rx="6"
            ry="3"
            transform="rotate(-15 245 78)"
          />
          <ellipse cx="95" cy="92" rx="6" ry="3" transform="rotate(8 95 92)" />
          <ellipse
            cx="140"
            cy="86"
            rx="7"
            ry="3.5"
            transform="rotate(-20 140 86)"
          />
          <ellipse
            cx="195"
            cy="92"
            rx="6"
            ry="3"
            transform="rotate(15 195 92)"
          />
          <ellipse
            cx="225"
            cy="95"
            rx="5"
            ry="2.5"
            transform="rotate(-5 225 95)"
          />
        </g>
        {/* Bean highlights — gives them dimension */}
        <g fill="#5C4632" opacity="0.6">
          <ellipse
            cx="80"
            cy="74"
            rx="3"
            ry="1.2"
            transform="rotate(-12 80 74)"
          />
          <ellipse
            cx="115"
            cy="61"
            rx="3.5"
            ry="1.5"
            transform="rotate(18 115 61)"
          />
          <ellipse
            cx="160"
            cy="54"
            rx="3"
            ry="1.2"
            transform="rotate(-8 160 54)"
          />
          <ellipse
            cx="210"
            cy="59"
            rx="3.5"
            ry="1.5"
            transform="rotate(22 210 59)"
          />
          <ellipse
            cx="140"
            cy="85"
            rx="3.5"
            ry="1.5"
            transform="rotate(-20 140 85)"
          />
        </g>
        {/* Herb flecks (parsley/cilantro) — green accents */}
        <g fill="#4A7822" opacity="0.7">
          <circle cx="100" cy="68" r="1.2" />
          <circle cx="175" cy="72" r="1" />
          <circle cx="225" cy="68" r="1.2" />
          <circle cx="125" cy="98" r="1" />
          <circle cx="180" cy="100" r="1.2" />
          <circle cx="60" cy="85" r="1" />
        </g>
        {/* Light grain (corn/breadcrumb texture) */}
        <g fill="#8A6F4A" opacity="0.4">
          <circle cx="130" cy="68" r="0.8" />
          <circle cx="185" cy="62" r="0.8" />
          <circle cx="155" cy="95" r="0.8" />
          <circle cx="105" cy="80" r="0.8" />
          <circle cx="240" cy="88" r="0.8" />
        </g>
      </g>
    }
  />
);

const ChickpeaPatty = () => (
  <IsometricBase
    thickness={13}
    front="#8B6440"
    top="#C4A068"
    specks={
      <g>
        {/* Chickpea bumps */}
        <g fill="#DCBA82">
          <ellipse cx="75" cy="78" rx="7" ry="3.5" transform="rotate(-8 75 78)" />
          <ellipse cx="120" cy="65" rx="8" ry="4" transform="rotate(12 120 65)" />
          <ellipse cx="165" cy="58" rx="7" ry="3.5" transform="rotate(-5 165 58)" />
          <ellipse cx="215" cy="62" rx="8" ry="4" transform="rotate(15 215 62)" />
          <ellipse cx="250" cy="75" rx="7" ry="3.5" transform="rotate(-10 250 75)" />
          <ellipse cx="95" cy="93" rx="7" ry="3.5" transform="rotate(10 95 93)" />
          <ellipse cx="145" cy="88" rx="8" ry="4" transform="rotate(-18 145 88)" />
          <ellipse cx="195" cy="90" rx="7" ry="3.5" transform="rotate(8 195 90)" />
          <ellipse cx="230" cy="95" rx="6" ry="3" transform="rotate(-6 230 95)" />
        </g>
        {/* Chickpea highlights */}
        <g fill="#EDD09A" opacity="0.7">
          <ellipse cx="75" cy="76" rx="3.5" ry="1.5" transform="rotate(-8 75 76)" />
          <ellipse cx="120" cy="63" rx="4" ry="1.7" transform="rotate(12 120 63)" />
          <ellipse cx="165" cy="56" rx="3.5" ry="1.5" transform="rotate(-5 165 56)" />
          <ellipse cx="215" cy="60" rx="4" ry="1.7" transform="rotate(15 215 60)" />
          <ellipse cx="145" cy="86" rx="4" ry="1.7" transform="rotate(-18 145 86)" />
        </g>
        {/* Dark gaps */}
        <g fill="#6A4A28" opacity="0.6">
          <circle cx="98" cy="72" r="2" />
          <circle cx="143" cy="68" r="1.8" />
          <circle cx="188" cy="72" r="2" />
          <circle cx="170" cy="92" r="1.8" />
          <circle cx="225" cy="82" r="2" />
        </g>
        {/* Herb flecks (parsley / coriander) */}
        <g fill="#527A18" opacity="0.8">
          <circle cx="105" cy="80" r="1.2" />
          <circle cx="178" cy="74" r="1" />
          <circle cx="235" cy="70" r="1.2" />
          <circle cx="130" cy="100" r="1" />
          <circle cx="185" cy="102" r="1.2" />
          <circle cx="62" cy="87" r="1" />
        </g>
        {/* Fine grain */}
        <g fill="#E8C890" opacity="0.35">
          <circle cx="135" cy="70" r="0.8" />
          <circle cx="190" cy="64" r="0.8" />
          <circle cx="158" cy="98" r="0.8" />
          <circle cx="108" cy="84" r="0.8" />
          <circle cx="245" cy="88" r="0.8" />
        </g>
      </g>
    }
  />
);

const MushroomPatty = () => (
  <IsometricBase
    thickness={13}
    front="#3A2415"
    top="#5E3C26"
    specks={
      <g>
        {/* Dark mushroom cap fragments */}
        <g fill="#2A180E" opacity="0.85">
          <ellipse cx="80" cy="74" rx="8" ry="3.5" transform="rotate(-15 80 74)" />
          <ellipse cx="130" cy="62" rx="9" ry="4" transform="rotate(20 130 62)" />
          <ellipse cx="175" cy="56" rx="7" ry="3.2" transform="rotate(-8 175 56)" />
          <ellipse cx="225" cy="65" rx="8" ry="3.5" transform="rotate(18 225 65)" />
          <ellipse cx="100" cy="92" rx="7" ry="3" transform="rotate(10 100 92)" />
          <ellipse cx="150" cy="88" rx="9" ry="4" transform="rotate(-22 150 88)" />
          <ellipse cx="205" cy="92" rx="7" ry="3.2" transform="rotate(12 205 92)" />
        </g>
        {/* Gill-like organic lines */}
        <g stroke="#2A180E" strokeWidth="1" fill="none" opacity="0.5">
          <path d="M 70 78 Q 90 70 110 82" />
          <path d="M 120 66 Q 145 56 165 68" />
          <path d="M 170 60 Q 195 52 215 64" />
          <path d="M 90 96 Q 115 88 140 98" />
          <path d="M 155 92 Q 180 82 205 94" />
        </g>
        {/* Lighter cap highlights */}
        <g fill="#8A6040" opacity="0.55">
          <ellipse cx="80" cy="72" rx="4" ry="1.5" transform="rotate(-15 80 72)" />
          <ellipse cx="130" cy="60" rx="4.5" ry="1.8" transform="rotate(20 130 60)" />
          <ellipse cx="175" cy="54" rx="3.5" ry="1.4" transform="rotate(-8 175 54)" />
          <ellipse cx="150" cy="86" rx="4.5" ry="1.8" transform="rotate(-22 150 86)" />
        </g>
        {/* Herb / thyme specks */}
        <g fill="#48681A" opacity="0.75">
          <circle cx="110" cy="76" r="1.2" />
          <circle cx="185" cy="70" r="1" />
          <circle cx="240" cy="72" r="1.2" />
          <circle cx="135" cy="100" r="1" />
          <circle cx="195" cy="100" r="1.2" />
          <circle cx="65" cy="85" r="1" />
        </g>
        {/* Fine spore grain */}
        <g fill="#7A5A3A" opacity="0.4">
          <circle cx="140" cy="68" r="0.8" />
          <circle cx="200" cy="60" r="0.8" />
          <circle cx="160" cy="96" r="0.8" />
          <circle cx="115" cy="84" r="0.8" />
          <circle cx="250" cy="84" r="0.8" />
        </g>
      </g>
    }
  />
);

// --- Cheese Components ---
const Cheddar = () => <CheeseBase fill="#FDB813" droopFill="#E59400" />;
const Emmental = () => <CheeseBase fill="#FFF3B0" droopFill="#D4C882" holes />;
const PepperCheese = () => (
  <CheeseBase
    fill="#FFFCEB"
    droopFill="#E0DBBC"
    specks={
      <g>
        <circle cx="80" cy="60" r="2" fill="#D32F2F" />
        <circle cx="150" cy="45" r="1.5" fill="#388E3C" />
        <circle cx="220" cy="65" r="2.5" fill="#D32F2F" />
        <circle cx="120" cy="85" r="1.5" fill="#388E3C" />
        <circle cx="250" cy="75" r="2" fill="#D32F2F" />
        <circle cx="180" cy="95" r="1.5" fill="#388E3C" />
      </g>
    }
  />
);
const CashewCheese = () => (
  <CheeseBase
    fill="#F0D9A8"
    droopFill="#C9A870"
    specks={
      <g>
        <g fill="#C8935A" opacity="0.5">
          <circle cx="90" cy="58" r="2.5" />
          <circle cx="145" cy="48" r="2" />
          <circle cx="200" cy="62" r="2.5" />
          <circle cx="125" cy="80" r="2" />
          <circle cx="230" cy="72" r="2.5" />
          <circle cx="170" cy="88" r="2" />
          <circle cx="75" cy="78" r="2" />
          <circle cx="260" cy="60" r="2" />
        </g>
        <g fill="#8A7A50" opacity="0.35">
          <circle cx="110" cy="65" r="1.2" />
          <circle cx="175" cy="55" r="1" />
          <circle cx="215" cy="80" r="1.2" />
          <circle cx="155" cy="90" r="1" />
          <circle cx="245" cy="68" r="1.2" />
        </g>
      </g>
    }
  />
);

const VeganSmoked = () => (
  <CheeseBase
    fill="#C87B3A"
    droopFill="#8E4E1A"
    specks={
      <g>
        <g fill="#3D1A05" opacity="0.35">
          <circle cx="85" cy="55" r="2" />
          <circle cx="140" cy="46" r="1.5" />
          <circle cx="195" cy="60" r="2" />
          <circle cx="120" cy="82" r="1.5" />
          <circle cx="235" cy="70" r="2" />
          <circle cx="165" cy="90" r="1.5" />
          <circle cx="70" cy="75" r="1.5" />
          <circle cx="255" cy="58" r="1.5" />
          <circle cx="220" cy="88" r="2" />
        </g>
        <g fill="#E09A60" opacity="0.4">
          <circle cx="105" cy="62" r="1.2" />
          <circle cx="170" cy="52" r="1" />
          <circle cx="210" cy="76" r="1.2" />
          <circle cx="150" cy="88" r="1" />
          <circle cx="248" cy="65" r="1" />
        </g>
      </g>
    }
  />
);

const Mozzarella = () => (
  <g>
    <path
      d="M 50 80 C 50 30, 270 30, 270 80 C 270 130, 50 130, 50 80 Z"
      fill="#FFFFFF"
    />
    <path
      d="M 50 80 C 50 130, 270 130, 270 80 C 250 110, 70 110, 50 80 Z"
      fill="#EAEAEA"
    />
  </g>
);

// --- Toppings ---
const Tomato = () => (
  <g>
    {/* Slice 1 */}
    <g transform="translate(-40, 0)">
      <IsometricBase thickness={6} front="#A61B10" top="#E63927" />
      <path
        d={`M ${left + 20} ${cy} Q 160 ${cpB - 10} ${right - 20} ${cy} Q 160 ${cpT + 10} ${left + 20} ${cy} Z`}
        fill="#B32114"
      />
    </g>
    {/* Slice 2 */}
    <g transform="translate(40, 10)">
      <IsometricBase thickness={6} front="#A61B10" top="#E63927" />
      <path
        d={`M ${left + 20} ${cy} Q 160 ${cpB - 10} ${right - 20} ${cy} Q 160 ${cpT + 10} ${left + 20} ${cy} Z`}
        fill="#B32114"
      />
    </g>
  </g>
);

const RedOnion = () => (
  <g stroke="#75225f" fill="none">
    <ellipse cx="160" cy="80" rx="100" ry="30" strokeWidth="6" />
    <ellipse cx="160" cy="80" rx="85" ry="25" strokeWidth="4" opacity="0.8" />
    <ellipse cx="160" cy="80" rx="70" ry="20" strokeWidth="3" opacity="0.6" />
    <ellipse cx="160" cy="80" rx="50" ry="15" strokeWidth="2" opacity="0.4" />
    <ellipse cx="100" cy="70" rx="40" ry="15" strokeWidth="4" />
    <ellipse cx="100" cy="70" rx="30" ry="10" strokeWidth="2" opacity="0.6" />
  </g>
);

const WhiteOnion = () => (
  <g stroke="#E8EAE3" fill="none">
    <ellipse cx="160" cy="80" rx="100" ry="30" strokeWidth="6" />
    <ellipse cx="160" cy="80" rx="85" ry="25" strokeWidth="4" opacity="0.8" />
    <ellipse cx="160" cy="80" rx="70" ry="20" strokeWidth="3" opacity="0.6" />
  </g>
);

const FriedOnion = () => (
  <g stroke="#965613" strokeWidth="4" fill="none">
    <path d="M 60 70 Q 100 50 140 80 T 200 60" />
    <path d="M 90 90 Q 130 110 180 80 T 260 90" />
    <path d="M 80 60 Q 120 40 180 70 T 240 50" opacity="0.8" />
    <path d="M 110 95 Q 150 115 190 85 T 230 100" opacity="0.7" />
    <path d="M 130 65 Q 170 45 220 75 T 270 55" opacity="0.9" />
  </g>
);

const Pickles = () => (
  <g>
    <g transform="translate(-60, 5)">
      <IsometricBase thickness={5} front="#32521c" top="#5c8738" />
      <path
        d={`M ${left + 20} ${cy} Q 160 ${cpB - 5} ${right - 20} ${cy} Q 160 ${cpT + 5} ${left + 20} ${cy} Z`}
        fill="#4A7527"
      />
    </g>
    <g transform="translate(50, -5) scale(0.9)">
      <IsometricBase thickness={5} front="#32521c" top="#5c8738" />
      <path
        d={`M ${left + 20} ${cy} Q 160 ${cpB - 5} ${right - 20} ${cy} Q 160 ${cpT + 5} ${left + 20} ${cy} Z`}
        fill="#4A7527"
      />
    </g>
    <g transform="translate(10, 20) scale(0.8)">
      <IsometricBase thickness={5} front="#32521c" top="#5c8738" />
      <path
        d={`M ${left + 20} ${cy} Q 160 ${cpB - 5} ${right - 20} ${cy} Q 160 ${cpT + 5} ${left + 20} ${cy} Z`}
        fill="#4A7527"
      />
    </g>
  </g>
);

const Bacon = () => (
  <g>
    <path
      d="M 40 80 Q 90 50 140 80 T 280 80 L 280 88 Q 230 58 180 88 T 40 88 Z"
      fill="#751A14"
    />
    <path
      d="M 40 75 Q 90 45 140 75 T 280 75 L 280 80 Q 230 50 180 80 T 40 80 Z"
      fill="#D9756C"
    />
    <path
      d="M 40 40 Q 90 70 140 40 T 280 40 L 280 48 Q 230 78 180 48 T 40 48 Z"
      fill="#751A14"
    />
    <path
      d="M 40 35 Q 90 65 140 35 T 280 35 L 280 40 Q 230 70 180 40 T 40 40 Z"
      fill="#D9756C"
    />
  </g>
);

const Pineapple = () => (
  <g>
    <path
      d={`M ${left} ${cy} Q 160 ${cpB} ${right} ${cy} L ${right} ${cy + 8} Q 160 ${cpB + 8} ${left} ${cy + 8} Z`}
      fill="#B8940C"
    />
    <path
      d={`M ${left} ${cy} A 135 40 0 1 0 ${right} ${cy} A 135 40 0 1 0 ${left} ${cy} Z M 130 ${cy} A 30 15 0 1 1 190 ${cy} A 30 15 0 1 1 130 ${cy} Z`}
      fill="#F4D03F"
      fillRule="evenodd"
    />
  </g>
);

const Guacamole = () => (
  <g>
    <path
      d="M 40 80 Q 90 40 160 50 Q 230 40 280 80 Q 260 120 160 110 Q 60 120 40 80 Z"
      fill="#4B7826"
    />
    <path
      d="M 40 80 Q 90 40 160 50 Q 230 40 280 80 Q 260 110 160 100 Q 60 110 40 80 Z"
      fill="#80B84D"
    />
  </g>
);

const Jalapeno = () => (
  <g stroke="#2B5B22" strokeWidth="6" fill="none">
    <ellipse cx="100" cy="65" rx="15" ry="6" transform="rotate(-10 100 65)" />
    <ellipse cx="150" cy="55" rx="12" ry="5" transform="rotate(20 150 55)" />
    <ellipse cx="200" cy="75" rx="14" ry="6" transform="rotate(-15 200 75)" />
    <ellipse cx="130" cy="90" rx="15" ry="6" />
    <ellipse cx="230" cy="65" rx="12" ry="5" transform="rotate(30 230 65)" />
    <ellipse cx="80" cy="85" rx="13" ry="5" transform="rotate(-25 80 85)" />
  </g>
);

const Peppers = () => (
  <g strokeWidth="4" fill="none">
    <path d="M 80 60 Q 120 40 160 70" stroke="#D32F2F" />
    <path d="M 140 90 Q 180 110 220 80" stroke="#FBC02D" />
    <path d="M 180 50 Q 220 30 260 60" stroke="#388E3C" />
    <path d="M 60 85 Q 100 105 140 75" stroke="#FBC02D" />
    <path d="M 120 65 Q 160 45 200 75" stroke="#D32F2F" />
    <path d="M 210 95 Q 250 115 290 85" stroke="#388E3C" />
  </g>
);

// --- Sauces ---
const SauceMayo = () => (
  <SauceDrip
    fill="#FDF6D5"
    droops={[
      { x: 80, w: 20, y: 100, h: 20 },
      { x: 150, w: 25, y: 110, h: 25 },
      { x: 220, w: 15, y: 100, h: 18 },
    ]}
  />
);

const SauceHabanero = () => (
  <SauceDrip
    fill="#E65100"
    droops={[
      { x: 90, w: 15, y: 105, h: 22 },
      { x: 180, w: 30, y: 112, h: 30 },
      { x: 250, w: 10, y: 95, h: 15 },
    ]}
  />
);

const SaucePiri = () => (
  <SauceDrip
    fill="#C62828"
    droops={[
      { x: 60, w: 10, y: 95, h: 18 },
      { x: 130, w: 20, y: 108, h: 28 },
      { x: 200, w: 18, y: 105, h: 25 },
      { x: 260, w: 12, y: 95, h: 15 },
    ]}
  />
);

// --- Buns ---
const BunBottomBrioche = () => (
  <IsometricBase thickness={30} front="#B57223" top="#F5CD90" />
);
const BunBottomSesame = () => (
  <IsometricBase thickness={30} front="#BA803A" top="#E8BB80" />
);
const BunBottomPaprika = () => (
  <IsometricBase thickness={30} front="#A64B29" top="#DD724B" />
);
const BunBottomCheese = () => (
  <IsometricBase thickness={30} front="#B57223" top="#F5CD90" />
);
const BunBottomChive = () => (
  <IsometricBase thickness={30} front="#A8834F" top="#D9AC6F" />
);

const BunTopBrioche = () => <Dome front="#D98A2B" top="#EDAA53" />;
const BunTopSesame = () => (
  <Dome
    front="#D99B41"
    top="#EDBB68"
    texture={
      <g fill="#FFFDE7">
        <circle cx="100" cy="20" r="1.5" />
        <circle cx="130" cy="10" r="1.5" />
        <circle cx="160" cy="5" r="1.5" />
        <circle cx="190" cy="15" r="1.5" />
        <circle cx="220" cy="30" r="1.5" />
        <circle cx="140" cy="25" r="1.5" />
        <circle cx="170" cy="25" r="1.5" />
        <circle cx="200" cy="40" r="1.5" />
        <circle cx="110" cy="40" r="1.5" />
      </g>
    }
  />
);
const BunTopPaprika = () => <Dome front="#C4562B" top="#E8764A" />;
const BunTopCheese = () => (
  <Dome
    front="#D98A2B"
    top="#EDAA53"
    texture={
      <path
        d="M 80 15 L 120 -40 L 200 -20 L 220 30 L 160 50 Z"
        fill="#F4B41A"
      />
    }
  />
);
const BunTopChive = () => (
  <Dome
    front="#BA945B"
    top="#EABF80"
    texture={
      <g>
        {/* Seeds */}
        <g fill="#FFFDE7">
          <circle cx="100" cy="20" r="1.5" />
          <circle cx="160" cy="5" r="1.5" />
          <circle cx="220" cy="30" r="1.5" />
        </g>
        {/* Chives */}
        <g stroke="#388E3C" strokeWidth="2" strokeLinecap="round">
          <path d="M 120 10 L 125 15" />
          <path d="M 180 20 L 175 25" />
          <path d="M 140 30 L 145 35" />
          <path d="M 200 10 L 195 15" />
          <path d="M 90 35 L 95 40" />
        </g>
      </g>
    }
  />
);

// Map components directly
export const SvgMap: Record<string, React.FC> = {
  // Bun Bottoms
  brioche_bottom: BunBottomBrioche,
  sesame_bottom: BunBottomSesame,
  paprika_bottom: BunBottomPaprika,
  cheeseTopped_bottom: BunBottomCheese,
  chiveSesame_bottom: BunBottomChive,
  // Bun Tops
  brioche_top: BunTopBrioche,
  sesame_top: BunTopSesame,
  paprika_top: BunTopPaprika,
  cheeseTopped_top: BunTopCheese,
  chiveSesame_top: BunTopChive,

  beefPatty: BeefPatty,
  grilledChicken: GrilledChicken,
  crispyChicken: CrispyChicken,
  blackBeanPatty: BlackBeanPatty,
  chickpeaPatty: ChickpeaPatty,
  mushroomPatty: MushroomPatty,

  cheddar: Cheddar,
  emmental: Emmental,
  pepperCheese: PepperCheese,
  mozzarella: Mozzarella,
  cashewCheese: CashewCheese,
  veganSmoked: VeganSmoked,

  tomato: Tomato,
  redOnion: RedOnion,
  whiteOnion: WhiteOnion,
  friedOnion: FriedOnion,
  pickles: Pickles,
  bacon: Bacon,
  pineapple: Pineapple,
  guacamole: Guacamole,
  jalapeno: Jalapeno,
  peppers: Peppers,

  sauceMayo: SauceMayo,
  sauceHabanero: SauceHabanero,
  saucePiri: SaucePiri,
};

export const IngredientSvg = ({
  ingredientId,
  isTopBun,
  isBottomBun,
}: {
  ingredientId: string;
  isTopBun?: boolean;
  isBottomBun?: boolean;
}) => {
  let lookupId = ingredientId;
  const isBun = INGREDIENTS[ingredientId]?.category === 'bun';

  if (isBun) {
    if (isTopBun) lookupId = `${ingredientId}_top`;
    else if (isBottomBun) lookupId = `${ingredientId}_bottom`;
    // Failsafe rendering full bun if neither specified maybe? Just bottom.
    else lookupId = `${ingredientId}_bottom`;
  }

  const SvgComponent = SvgMap[lookupId];

  if (!SvgComponent) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] filter-drop-shadow"
      style={{ filter: 'drop-shadow(0px 6px 6px rgba(0,0,0,0.25))' }}
    >
      <SvgComponent />
    </svg>
  );
};
