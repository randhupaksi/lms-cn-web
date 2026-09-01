# Features

Each business domain gets an isolated feature module. Features must not import
from another feature directly; shared behavior belongs in `components`,
`config`, `hooks`, `services`, `lib`, `providers`, or `types`.
