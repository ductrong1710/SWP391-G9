using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Businessobjects.Migrations
{
    /// <inheritdoc />
    public partial class AddDoseNumberToVaccinationPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Health_Check_Consent_Form_Users_ParentID",
                table: "Health_Check_Consent_Form");

            migrationBuilder.DropForeignKey(
                name: "FK_Health_Record_Users_StudentID",
                table: "Health_Record");

            migrationBuilder.DropForeignKey(
                name: "FK_IncidentInvolvement_MedicalIncident_MedicalIncidentID",
                table: "IncidentInvolvement");

            migrationBuilder.DropForeignKey(
                name: "FK_IncidentInvolvement_Users_StudentID",
                table: "IncidentInvolvement");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalIncident_Users_MedicalStaffID",
                table: "MedicalIncident");

            migrationBuilder.DropIndex(
                name: "IX_Health_Check_Result_HealthCheckConsentID",
                table: "Health_Check_Result");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalIncident",
                table: "MedicalIncident");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IncidentInvolvement",
                table: "IncidentInvolvement");

            migrationBuilder.DropColumn(
                name: "ConsentStatus",
                table: "Health_Check_Consent_Form");

            migrationBuilder.DropColumn(
                name: "ActionTaken",
                table: "MedicalIncident");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "MedicalIncident");

            migrationBuilder.DropColumn(
                name: "FollowUpDate",
                table: "MedicalIncident");

            migrationBuilder.DropColumn(
                name: "FollowUpRequired",
                table: "MedicalIncident");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "IncidentInvolvement");

            migrationBuilder.DropColumn(
                name: "TreatmentDate",
                table: "IncidentInvolvement");

            migrationBuilder.RenameTable(
                name: "MedicalIncident",
                newName: "MedicalIncidents");

            migrationBuilder.RenameTable(
                name: "IncidentInvolvement",
                newName: "IncidentInvolvements");

            migrationBuilder.RenameColumn(
                name: "Class",
                table: "Profile",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "HealthCheckConsentFormId",
                table: "Notification",
                newName: "ConsentFormID");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "MedicalIncidents",
                newName: "Note");

            migrationBuilder.RenameColumn(
                name: "Severity",
                table: "MedicalIncidents",
                newName: "IncidentMeasures");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "MedicalIncidents",
                newName: "IncidentDescription");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "MedicalIncidents",
                newName: "HandlingResults");

            migrationBuilder.RenameColumn(
                name: "IncidentDate",
                table: "MedicalIncidents",
                newName: "RecordTime");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "MedicalIncidents",
                newName: "IncidentID");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalIncident_MedicalStaffID",
                table: "MedicalIncidents",
                newName: "IX_MedicalIncidents_MedicalStaffID");

            migrationBuilder.RenameColumn(
                name: "TreatmentRequired",
                table: "IncidentInvolvements",
                newName: "TreatmentGiven");

            migrationBuilder.RenameColumn(
                name: "MedicalIncidentID",
                table: "IncidentInvolvements",
                newName: "IncidentID");

            migrationBuilder.RenameColumn(
                name: "InvolvementType",
                table: "IncidentInvolvements",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "Injuries",
                table: "IncidentInvolvements",
                newName: "InjuryDescription");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "IncidentInvolvements",
                newName: "InvolvementID");

            migrationBuilder.RenameIndex(
                name: "IX_IncidentInvolvement_StudentID",
                table: "IncidentInvolvements",
                newName: "IX_IncidentInvolvements_StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_IncidentInvolvement_MedicalIncidentID",
                table: "IncidentInvolvements",
                newName: "IX_IncidentInvolvements_IncidentID");

            migrationBuilder.AlterColumn<string>(
                name: "VaccineName",
                table: "Vaccine_Type",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Vaccine_Type",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "VaccinationID",
                table: "Vaccine_Type",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "VaccineTypeID",
                table: "Vaccination_Result",
                type: "nvarchar(6)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "PostVaccinationReaction",
                table: "Vaccination_Result",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Performer",
                table: "Vaccination_Result",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Vaccination_Result",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FailureReason",
                table: "Vaccination_Result",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NeedToContactParent",
                table: "Vaccination_Result",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostponementReason",
                table: "Vaccination_Result",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecordedBy",
                table: "Vaccination_Result",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RecordedDate",
                table: "Vaccination_Result",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "RefusalReason",
                table: "Vaccination_Result",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VaccinationStatus",
                table: "Vaccination_Result",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Vaccination_Plan",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DoseNumber",
                table: "Vaccination_Plan",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Vaccination_Plan",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClassID",
                table: "Profile",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClassID",
                table: "Periodic_Health_Check_Plan",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Periodic_Health_Check_Plan",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Periodic_Health_Check_Plan",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Weight",
                table: "Health_Check_Result",
                type: "int",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Height",
                table: "Health_Check_Result",
                type: "int",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HealthCheckConsentID",
                table: "Health_Check_Result",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Health_Check_Result",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StudentID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ParentID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "HealthCheckPlanID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "StatusID",
                table: "Health_Check_Consent_Form",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalIncidents",
                table: "MedicalIncidents",
                column: "IncidentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IncidentInvolvements",
                table: "IncidentInvolvements",
                column: "InvolvementID");

            migrationBuilder.CreateTable(
                name: "SchoolClass",
                columns: table => new
                {
                    ClassID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClassName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grade = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolClass", x => x.ClassID);
                });

            migrationBuilder.CreateTable(
                name: "Status",
                columns: table => new
                {
                    StatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Status", x => x.StatusID);
                });

            migrationBuilder.CreateTable(
                name: "SupplyMedUsages",
                columns: table => new
                {
                    UsageID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IncidentID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SupplyID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    MedicationID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    QuantityUsed = table.Column<int>(type: "int", nullable: true),
                    UsageTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UsagePurpose = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdministeredBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplyMedUsages", x => x.UsageID);
                    table.ForeignKey(
                        name: "FK_SupplyMedUsages_MedicalIncidents_IncidentID",
                        column: x => x.IncidentID,
                        principalTable: "MedicalIncidents",
                        principalColumn: "IncidentID");
                    table.ForeignKey(
                        name: "FK_SupplyMedUsages_Medical_Supply_SupplyID",
                        column: x => x.SupplyID,
                        principalTable: "Medical_Supply",
                        principalColumn: "SupplyID");
                    table.ForeignKey(
                        name: "FK_SupplyMedUsages_Medication_MedicationID",
                        column: x => x.MedicationID,
                        principalTable: "Medication",
                        principalColumn: "MedicationID");
                });

            migrationBuilder.CreateTable(
                name: "VaccineDisease",
                columns: table => new
                {
                    VaccineDiseaseID = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    VaccinationID = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    DiseaseName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RequiredDoses = table.Column<int>(type: "int", nullable: true),
                    IntervalBetweenDoses = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccineDisease", x => x.VaccineDiseaseID);
                    table.ForeignKey(
                        name: "FK_VaccineDisease_Vaccine_Type_VaccinationID",
                        column: x => x.VaccinationID,
                        principalTable: "Vaccine_Type",
                        principalColumn: "VaccinationID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Profile",
                keyColumn: "ProfileID",
                keyValue: "f5b7824f-5e35-4682-98d1-0e98f8dd6b31",
                columns: new[] { "ClassID", "Email" },
                values: new object[] { null, null });

            migrationBuilder.InsertData(
                table: "Status",
                columns: new[] { "StatusID", "StatusName" },
                values: new object[,]
                {
                    { 1, "Accept" },
                    { 2, "Deny" },
                    { 3, "Waiting" }
                });

            migrationBuilder.InsertData(
                table: "Vaccine_Type",
                columns: new[] { "VaccinationID", "Description", "VaccineName" },
                values: new object[,]
                {
                    { "VC0001", "Bảo vệ chống lại virus viêm gan B", "Vắc-xin Viêm gan B" },
                    { "VC0002", "Ngăn ngừa các bệnh sởi, quai bị và rubella", "Vắc-xin Sởi - Quai bị - Rubella" },
                    { "VC0003", "Bảo vệ chống lại bạch hầu, ho gà và uốn ván", "Vắc-xin DPT" }
                });

            migrationBuilder.InsertData(
                table: "VaccineDisease",
                columns: new[] { "VaccineDiseaseID", "DiseaseName", "IntervalBetweenDoses", "RequiredDoses", "VaccinationID" },
                values: new object[,]
                {
                    { "VD0001", "Viêm gan B", null, 3, "VC0001" },
                    { "VD0002", "Sởi", null, 2, "VC0002" },
                    { "VD0003", "Quai bị", null, 2, "VC0002" },
                    { "VD0004", "Rubella", null, 2, "VC0002" },
                    { "VD0005", "Bạch hầu", null, 4, "VC0003" },
                    { "VD0006", "Ho gà", null, 4, "VC0003" },
                    { "VD0007", "Uốn ván", null, 4, "VC0003" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Periodic_Health_Check_Plan_ClassID",
                table: "Periodic_Health_Check_Plan",
                column: "ClassID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Result_HealthCheckConsentID",
                table: "Health_Check_Result",
                column: "HealthCheckConsentID",
                unique: true,
                filter: "[HealthCheckConsentID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Consent_Form_StatusID",
                table: "Health_Check_Consent_Form",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_SupplyMedUsages_IncidentID",
                table: "SupplyMedUsages",
                column: "IncidentID");

            migrationBuilder.CreateIndex(
                name: "IX_SupplyMedUsages_MedicationID",
                table: "SupplyMedUsages",
                column: "MedicationID");

            migrationBuilder.CreateIndex(
                name: "IX_SupplyMedUsages_SupplyID",
                table: "SupplyMedUsages",
                column: "SupplyID");

            migrationBuilder.CreateIndex(
                name: "IX_VaccineDisease_VaccinationID",
                table: "VaccineDisease",
                column: "VaccinationID");

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Check_Consent_Form_Status_StatusID",
                table: "Health_Check_Consent_Form",
                column: "StatusID",
                principalTable: "Status",
                principalColumn: "StatusID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Check_Consent_Form_Users_ParentID",
                table: "Health_Check_Consent_Form",
                column: "ParentID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Record_Users_StudentID",
                table: "Health_Record",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_IncidentInvolvements_MedicalIncidents_IncidentID",
                table: "IncidentInvolvements",
                column: "IncidentID",
                principalTable: "MedicalIncidents",
                principalColumn: "IncidentID");

            migrationBuilder.AddForeignKey(
                name: "FK_IncidentInvolvements_Users_StudentID",
                table: "IncidentInvolvements",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalIncidents_Users_MedicalStaffID",
                table: "MedicalIncidents",
                column: "MedicalStaffID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Periodic_Health_Check_Plan_SchoolClass_ClassID",
                table: "Periodic_Health_Check_Plan",
                column: "ClassID",
                principalTable: "SchoolClass",
                principalColumn: "ClassID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Health_Check_Consent_Form_Status_StatusID",
                table: "Health_Check_Consent_Form");

            migrationBuilder.DropForeignKey(
                name: "FK_Health_Check_Consent_Form_Users_ParentID",
                table: "Health_Check_Consent_Form");

            migrationBuilder.DropForeignKey(
                name: "FK_Health_Record_Users_StudentID",
                table: "Health_Record");

            migrationBuilder.DropForeignKey(
                name: "FK_IncidentInvolvements_MedicalIncidents_IncidentID",
                table: "IncidentInvolvements");

            migrationBuilder.DropForeignKey(
                name: "FK_IncidentInvolvements_Users_StudentID",
                table: "IncidentInvolvements");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalIncidents_Users_MedicalStaffID",
                table: "MedicalIncidents");

            migrationBuilder.DropForeignKey(
                name: "FK_Periodic_Health_Check_Plan_SchoolClass_ClassID",
                table: "Periodic_Health_Check_Plan");

            migrationBuilder.DropTable(
                name: "SchoolClass");

            migrationBuilder.DropTable(
                name: "Status");

            migrationBuilder.DropTable(
                name: "SupplyMedUsages");

            migrationBuilder.DropTable(
                name: "VaccineDisease");

            migrationBuilder.DropIndex(
                name: "IX_Periodic_Health_Check_Plan_ClassID",
                table: "Periodic_Health_Check_Plan");

            migrationBuilder.DropIndex(
                name: "IX_Health_Check_Result_HealthCheckConsentID",
                table: "Health_Check_Result");

            migrationBuilder.DropIndex(
                name: "IX_Health_Check_Consent_Form_StatusID",
                table: "Health_Check_Consent_Form");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalIncidents",
                table: "MedicalIncidents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IncidentInvolvements",
                table: "IncidentInvolvements");

            migrationBuilder.DeleteData(
                table: "Vaccine_Type",
                keyColumn: "VaccinationID",
                keyValue: "VC0001");

            migrationBuilder.DeleteData(
                table: "Vaccine_Type",
                keyColumn: "VaccinationID",
                keyValue: "VC0002");

            migrationBuilder.DeleteData(
                table: "Vaccine_Type",
                keyColumn: "VaccinationID",
                keyValue: "VC0003");

            migrationBuilder.DropColumn(
                name: "FailureReason",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "NeedToContactParent",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "PostponementReason",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "RecordedBy",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "RecordedDate",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "RefusalReason",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "VaccinationStatus",
                table: "Vaccination_Result");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Vaccination_Plan");

            migrationBuilder.DropColumn(
                name: "DoseNumber",
                table: "Vaccination_Plan");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Vaccination_Plan");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "Profile");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "Periodic_Health_Check_Plan");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Periodic_Health_Check_Plan");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Periodic_Health_Check_Plan");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Health_Check_Result");

            migrationBuilder.DropColumn(
                name: "StatusID",
                table: "Health_Check_Consent_Form");

            migrationBuilder.RenameTable(
                name: "MedicalIncidents",
                newName: "MedicalIncident");

            migrationBuilder.RenameTable(
                name: "IncidentInvolvements",
                newName: "IncidentInvolvement");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Profile",
                newName: "Class");

            migrationBuilder.RenameColumn(
                name: "ConsentFormID",
                table: "Notification",
                newName: "HealthCheckConsentFormId");

            migrationBuilder.RenameColumn(
                name: "RecordTime",
                table: "MedicalIncident",
                newName: "IncidentDate");

            migrationBuilder.RenameColumn(
                name: "Note",
                table: "MedicalIncident",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "IncidentMeasures",
                table: "MedicalIncident",
                newName: "Severity");

            migrationBuilder.RenameColumn(
                name: "IncidentDescription",
                table: "MedicalIncident",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "HandlingResults",
                table: "MedicalIncident",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "IncidentID",
                table: "MedicalIncident",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalIncidents_MedicalStaffID",
                table: "MedicalIncident",
                newName: "IX_MedicalIncident_MedicalStaffID");

            migrationBuilder.RenameColumn(
                name: "TreatmentGiven",
                table: "IncidentInvolvement",
                newName: "TreatmentRequired");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "IncidentInvolvement",
                newName: "InvolvementType");

            migrationBuilder.RenameColumn(
                name: "InjuryDescription",
                table: "IncidentInvolvement",
                newName: "Injuries");

            migrationBuilder.RenameColumn(
                name: "IncidentID",
                table: "IncidentInvolvement",
                newName: "MedicalIncidentID");

            migrationBuilder.RenameColumn(
                name: "InvolvementID",
                table: "IncidentInvolvement",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_IncidentInvolvements_StudentID",
                table: "IncidentInvolvement",
                newName: "IX_IncidentInvolvement_StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_IncidentInvolvements_IncidentID",
                table: "IncidentInvolvement",
                newName: "IX_IncidentInvolvement_MedicalIncidentID");

            migrationBuilder.AlterColumn<string>(
                name: "VaccineName",
                table: "Vaccine_Type",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Vaccine_Type",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "VaccinationID",
                table: "Vaccine_Type",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(6)",
                oldMaxLength: 6);

            migrationBuilder.AlterColumn<string>(
                name: "VaccineTypeID",
                table: "Vaccination_Result",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(6)");

            migrationBuilder.AlterColumn<string>(
                name: "PostVaccinationReaction",
                table: "Vaccination_Result",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Performer",
                table: "Vaccination_Result",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Vaccination_Result",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Weight",
                table: "Health_Check_Result",
                type: "decimal(5,2)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Height",
                table: "Health_Check_Result",
                type: "decimal(5,2)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HealthCheckConsentID",
                table: "Health_Check_Result",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StudentID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ParentID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HealthCheckPlanID",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsentStatus",
                table: "Health_Check_Consent_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActionTaken",
                table: "MedicalIncident",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "MedicalIncident",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FollowUpDate",
                table: "MedicalIncident",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FollowUpRequired",
                table: "MedicalIncident",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "IncidentInvolvement",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TreatmentDate",
                table: "IncidentInvolvement",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalIncident",
                table: "MedicalIncident",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IncidentInvolvement",
                table: "IncidentInvolvement",
                column: "ID");

            migrationBuilder.UpdateData(
                table: "Profile",
                keyColumn: "ProfileID",
                keyValue: "f5b7824f-5e35-4682-98d1-0e98f8dd6b31",
                column: "Class",
                value: "Admin Class");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Result_HealthCheckConsentID",
                table: "Health_Check_Result",
                column: "HealthCheckConsentID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Check_Consent_Form_Users_ParentID",
                table: "Health_Check_Consent_Form",
                column: "ParentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Record_Users_StudentID",
                table: "Health_Record",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IncidentInvolvement_MedicalIncident_MedicalIncidentID",
                table: "IncidentInvolvement",
                column: "MedicalIncidentID",
                principalTable: "MedicalIncident",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_IncidentInvolvement_Users_StudentID",
                table: "IncidentInvolvement",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalIncident_Users_MedicalStaffID",
                table: "MedicalIncident",
                column: "MedicalStaffID",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
