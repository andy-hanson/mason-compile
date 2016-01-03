import { For, ForBag, Iteratee } from '../ast/Loop';
export default function verifyFor(_: For | ForBag): void;
export declare function withVerifyIteratee({element, bag}: Iteratee, action: () => void): void;
