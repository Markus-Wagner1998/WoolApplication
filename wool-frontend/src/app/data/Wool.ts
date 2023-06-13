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
        public intensity: number, 
        public initialAmount: number, 
        public remainingAmount: number, 
        public singleAmount: number, 
        public tags: InventoryTag[], 
        public images: InventoryImage[]
    ) {}
}