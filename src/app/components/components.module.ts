import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { MenuSComponent } from "./menu-s/menu-s.component";

@NgModule({
    declarations : [
        MenuSComponent
    ],
    exports: [
        MenuSComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class ComponentsModule {}