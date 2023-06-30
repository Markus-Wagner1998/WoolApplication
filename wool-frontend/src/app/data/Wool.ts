export class InventoryImage {
    constructor(
        public id: number, 
        public imageBase64: string
    ){}
}

export class InventoryTag {
    constructor(
        public id: number,
        public tag: string
    ) {}
}

export class Wool {
    constructor(
        public id: number, 
        public name: string, 
        public color: string, 
        public brand: string, 
        public intensity: number | undefined, 
        public initialAmount: number | undefined, 
        public remainingAmount: number | undefined, 
        public singleAmount: number | undefined, 
        public tags: InventoryTag[], 
        public images: InventoryImage[]
    ) {}
}

export class WoolFilter {
    constructor(
        public name: string | undefined, 
        public color: string | undefined, 
        public brand: string | undefined, 
        public intensityMin: number | undefined, 
        public intensityMax: number | undefined, 
        public initialAmountMin: number | undefined, 
        public initialAmountMax: number | undefined, 
        public remainingAmountMin: number | undefined, 
        public remainingAmountMax: number | undefined, 
        public singleAmountMin: number | undefined, 
        public singleAmountMax: number | undefined, 
    ) {}
}

export class Image {
    constructor(
        public source: string,
        public file: File | null,
        public base64: string,
    ) {}
}