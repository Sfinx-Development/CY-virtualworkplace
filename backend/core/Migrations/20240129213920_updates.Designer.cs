﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using core;

#nullable disable

namespace core.Migrations
{
    [DbContext(typeof(CyDbContext))]
    [Migration("20240129213920_updates")]
    partial class updates
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("core.Conversation", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("CreatorId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Conversations");
                });

            modelBuilder.Entity("core.ConversationParticipant", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ConversationId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProfileId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("ConversationId");

                    b.HasIndex("ProfileId");

                    b.ToTable("ConversationParticipants");
                });

            modelBuilder.Entity("core.Cy", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("HealthCheckInterval")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Cys");
                });

            modelBuilder.Entity("core.HealthCheck", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("CyId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("HealthAverageStat")
                        .HasColumnType("int");

                    b.Property<DateTime>("HealthCheckTime")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("CyId");

                    b.ToTable("HealthChecks");
                });

            modelBuilder.Entity("core.Meeting", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Interval")
                        .HasColumnType("int");

                    b.Property<bool>("IsRepeating")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("Minutes")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("OwnerId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("RoomId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("RoomId");

                    b.ToTable("Meetings");
                });

            modelBuilder.Entity("core.MeetingOccasion", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("MeetingId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProfileId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("MeetingId");

                    b.HasIndex("ProfileId");

                    b.ToTable("MeetingOccasions");
                });

            modelBuilder.Entity("core.Message", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("ConversationParticipantId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("ConversationParticipantId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("core.Profile", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsOwner")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("TeamId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("TeamId");

                    b.HasIndex("UserId");

                    b.ToTable("Profiles");
                });

            modelBuilder.Entity("core.Room", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("CyId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("RoomLayout")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("CyId");

                    b.ToTable("Room");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Room");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("core.Team", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("TeamRole")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("core.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("Age")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("core.MeetingRoom", b =>
                {
                    b.HasBaseType("core.Room");

                    b.Property<string>("TeamId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasIndex("TeamId");

                    b.HasDiscriminator().HasValue("MeetingRoom");
                });

            modelBuilder.Entity("core.Office", b =>
                {
                    b.HasBaseType("core.Room");

                    b.Property<string>("ProfileId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasIndex("ProfileId");

                    b.HasDiscriminator().HasValue("Office");
                });

            modelBuilder.Entity("core.ConversationParticipant", b =>
                {
                    b.HasOne("core.Conversation", "Conversation")
                        .WithMany()
                        .HasForeignKey("ConversationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("core.Profile", "Profile")
                        .WithMany("ConversationParticipants")
                        .HasForeignKey("ProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Conversation");

                    b.Navigation("Profile");
                });

            modelBuilder.Entity("core.HealthCheck", b =>
                {
                    b.HasOne("core.Cy", "Cy")
                        .WithMany("HealthChecks")
                        .HasForeignKey("CyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Cy");
                });

            modelBuilder.Entity("core.Meeting", b =>
                {
                    b.HasOne("core.Room", "Room")
                        .WithMany()
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");
                });

            modelBuilder.Entity("core.MeetingOccasion", b =>
                {
                    b.HasOne("core.Meeting", "Meeting")
                        .WithMany()
                        .HasForeignKey("MeetingId");

                    b.HasOne("core.Profile", "Profile")
                        .WithMany()
                        .HasForeignKey("ProfileId");

                    b.Navigation("Meeting");

                    b.Navigation("Profile");
                });

            modelBuilder.Entity("core.Message", b =>
                {
                    b.HasOne("core.ConversationParticipant", null)
                        .WithMany("Messages")
                        .HasForeignKey("ConversationParticipantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("core.Profile", b =>
                {
                    b.HasOne("core.Team", "Team")
                        .WithMany("Profiles")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("core.User", "User")
                        .WithMany("Profiles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");

                    b.Navigation("User");
                });

            modelBuilder.Entity("core.Room", b =>
                {
                    b.HasOne("core.Cy", "Cy")
                        .WithMany()
                        .HasForeignKey("CyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Cy");
                });

            modelBuilder.Entity("core.MeetingRoom", b =>
                {
                    b.HasOne("core.Team", "Team")
                        .WithMany()
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");
                });

            modelBuilder.Entity("core.Office", b =>
                {
                    b.HasOne("core.Profile", "Profile")
                        .WithMany()
                        .HasForeignKey("ProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Profile");
                });

            modelBuilder.Entity("core.ConversationParticipant", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("core.Cy", b =>
                {
                    b.Navigation("HealthChecks");
                });

            modelBuilder.Entity("core.Profile", b =>
                {
                    b.Navigation("ConversationParticipants");
                });

            modelBuilder.Entity("core.Team", b =>
                {
                    b.Navigation("Profiles");
                });

            modelBuilder.Entity("core.User", b =>
                {
                    b.Navigation("Profiles");
                });
#pragma warning restore 612, 618
        }
    }
}
