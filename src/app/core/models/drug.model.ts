import { DrugFlavor } from './drug-flavor.model';
import { DrugMovement } from './drug-movement.model';
import { DrugNature } from './drug-nature.model';
import { Organ } from './organ.model';

export interface DrugEffect {
  text: string;
  yaoYao: boolean;
}

export interface Drug {
  id: number;
  name: string;
  latinName?: string;
  frenchName?: string;
  alternativeChineseNames?: string[];
  nature?: DrugNature;
  flavors?: DrugFlavor[];
  movements?: DrugMovement[];
  tropism?: Organ[];
  contraindications?: string[];
  effects?: DrugEffect[];
  dosage?: string;
  numberOfStars?: number;
  categoryId?: number;
  additionalNotes?: string;
}

export interface DrugAssociation {
  associatedDrugId: number;
  associatedDrugName: string;
  effects: DrugEffect[];
}

export interface DrugDetail extends Drug {
  associations: DrugAssociation[];
}
